import { Cache } from "@/utils/services/redis/cacheService";
import { CacheTTL, type CacheTTLKey } from "@/utils/types/cache";
import { Logging } from "@/logs";

/**
 * Read-through cache helper.
 * Check Redis first; on miss, call `fetcher()`, cache the result, return it.
 * All JSON serialization is handled internally.
 *
 * @param key   - Redis key (use CacheKeys.* builders)
 * @param ttl   - TTL in seconds, or a CacheTTLKey name
 * @param fetcher - async function that returns the fresh data
 */
export async function cached<T>(
	key: string,
	ttl: number | CacheTTLKey,
	fetcher: () => Promise<T>,
): Promise<T> {
	const raw = await Cache.cache.get(key);
	if (raw !== null) {
		Logging.dev(`[Cache] HIT ${key}`);
		return JSON.parse(raw) as T;
	}

	Logging.dev(`[Cache] MISS ${key}`);
	const data = await fetcher();
	const seconds = typeof ttl === "string" ? CacheTTL[ttl] : ttl;

	// fire-and-forget — don't block response for the cache write
	Cache.cache.set(key, JSON.stringify(data), { EX: seconds }).catch(() => {});

	return data;
}

/**
 * Invalidate one or more cache keys.
 * Accepts a single key or an array (from CacheInvalidation.* helpers).
 */
export async function invalidateCache(keys: string | string[]): Promise<void> {
	const list = Array.isArray(keys) ? keys : [keys];
	if (list.length === 0) return;
	Logging.dev(`[Cache] INVALIDATE ${list.join(", ")}`);
	await Promise.all(list.map((k) => Cache.cache.del(k).catch(() => {})));
}
