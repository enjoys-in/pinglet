import type { QuietHoursConfig, RateLimitConfig } from "@/utils/interfaces/project.interface";
import { Cache } from "@/utils/services/redis/cacheService";

/**
 * Checks if the current time falls within the project's quiet hours.
 * Returns true if notifications should be suppressed.
 */
export function isInQuietHours(config: QuietHoursConfig | null | undefined): boolean {
	if (!config?.enabled) return false;

	const { start, end, timezone } = config;
	if (!start || !end) return false;

	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: timezone || "UTC",
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
	});
	const parts = formatter.formatToParts(now);
	const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
	const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
	const currentMinutes = hour * 60 + minute;

	const [startH, startM] = start.split(":").map(Number);
	const [endH, endM] = end.split(":").map(Number);
	const startMinutes = startH * 60 + startM;
	const endMinutes = endH * 60 + endM;

	// Handle overnight ranges like 22:00 - 08:00
	if (startMinutes <= endMinutes) {
		return currentMinutes >= startMinutes && currentMinutes < endMinutes;
	}
	return currentMinutes >= startMinutes || currentMinutes < endMinutes;
}

/**
 * Rate limiting per subscriber per project using Redis counters.
 * Returns { allowed: true } if within limits, or { allowed: false, retryAfterMs } if exceeded.
 */
export async function checkSubscriberRateLimit(
	projectId: string,
	subscriberEndpoint: string,
	config: RateLimitConfig | null | undefined,
): Promise<{ allowed: boolean; retryAfterMs?: number }> {
	if (!config?.enabled) return { allowed: true };

	const subscriberHash = Buffer.from(subscriberEndpoint).toString("base64url").slice(0, 32);
	const hourKey = `ratelimit:${projectId}:${subscriberHash}:hour`;
	const dayKey = `ratelimit:${projectId}:${subscriberHash}:day`;

	const [hourCount, dayCount] = await Promise.all([
		Cache.cache.get(hourKey),
		Cache.cache.get(dayKey),
	]);

	const currentHour = Number(hourCount ?? 0);
	const currentDay = Number(dayCount ?? 0);

	if (currentHour >= config.max_per_subscriber_per_hour) {
		return { allowed: false, retryAfterMs: 3600_000 };
	}
	if (currentDay >= config.max_per_subscriber_per_day) {
		return { allowed: false, retryAfterMs: 86400_000 };
	}

	// Increment counters atomically
	const pipeline = Cache.cache.multi();
	pipeline.incr(hourKey);
	pipeline.expire(hourKey, 3600);
	pipeline.incr(dayKey);
	pipeline.expire(dayKey, 86400);
	await pipeline.exec();

	return { allowed: true };
}
