import { Cache } from "@/utils/services/redis/cacheService";

const PRESENCE_PREFIX = "presence:";
const PRESENCE_TTL = 120; // 2 minutes, refreshed by heartbeat

class LivePresenceService {
	/**
	 * Register a subscriber as online (called when SSE connects).
	 */
	async connect(projectId: string, connectionId: string) {
		const key = `${PRESENCE_PREFIX}${projectId}`;
		await Cache.cache.sAdd(key, connectionId);
		await Cache.cache.expire(key, PRESENCE_TTL);
		// Also set individual connection key for TTL-based cleanup
		await Cache.cache.set(`${PRESENCE_PREFIX}conn:${connectionId}`, projectId, { EX: PRESENCE_TTL });
	}

	/**
	 * Refresh presence (called periodically from SSE heartbeat).
	 */
	async heartbeat(projectId: string, connectionId: string) {
		const key = `${PRESENCE_PREFIX}${projectId}`;
		await Cache.cache.expire(key, PRESENCE_TTL);
		await Cache.cache.expire(`${PRESENCE_PREFIX}conn:${connectionId}`, PRESENCE_TTL);
	}

	/**
	 * Remove a subscriber from online set (called when SSE disconnects).
	 */
	async disconnect(projectId: string, connectionId: string) {
		const key = `${PRESENCE_PREFIX}${projectId}`;
		await Cache.cache.sRem(key, connectionId);
		await Cache.cache.del(`${PRESENCE_PREFIX}conn:${connectionId}`);
	}

	/**
	 * Get count of online subscribers for a project.
	 */
	async getOnlineCount(projectId: string): Promise<number> {
		const key = `${PRESENCE_PREFIX}${projectId}`;
		return Cache.cache.sCard(key);
	}

	/**
	 * Get online counts for multiple projects (for dashboard).
	 */
	async getOnlineCounts(projectIds: string[]): Promise<Record<string, number>> {
		const result: Record<string, number> = {};
		await Promise.all(
			projectIds.map(async (pid) => {
				result[pid] = await this.getOnlineCount(pid);
			}),
		);
		return result;
	}

	/**
	 * Get all online connection IDs for a project.
	 */
	async getOnlineMembers(projectId: string): Promise<string[]> {
		const key = `${PRESENCE_PREFIX}${projectId}`;
		return Cache.cache.sMembers(key);
	}
}

export const livePresenceService = new LivePresenceService();
