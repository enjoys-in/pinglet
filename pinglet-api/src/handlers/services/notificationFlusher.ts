import { NotificationLogEntity } from "@/factory/entities/notifications-log.entity";
import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { Cache } from "@/utils/services/redis/cacheService";
import { REDIS_KEYS_NAME } from "@/utils/services/redis/name";

import { Repository } from "typeorm";


export class NotificationFlusherService {
    private readonly redis = Cache.cache;
    constructor(
        private readonly notificationRepo: Repository<NotificationEntity>,
        private readonly notificationLogRepo: Repository<NotificationLogEntity>) {
        this.notificationRepo = notificationRepo;
        this.notificationLogRepo = notificationLogRepo
    }

    async flush(projectId: string): Promise<void> {

        const baseCounterKey = REDIS_KEYS_NAME.ANALYTICS_DELTA.replace('projectId', projectId);
        const baseBufferKey = REDIS_KEYS_NAME.ANALYTICS_BUFFER.replace('projectId', projectId);

        const timestamp = Date.now();

        const tmpCounterKey = `${baseCounterKey}:tmp:${timestamp}`;
        const tmpBufferKey = `${baseBufferKey}:tmp:${timestamp}`;
        const ttlSeconds = 60 * 15;

        // Atomic renaming with fallback safety
        const pipeline = this.redis.multi();
        const [counterExists, bufferExists] = await Promise.all([
            this.redis.exists(baseCounterKey),
            this.redis.exists(baseBufferKey),
        ]);

        if (counterExists) {
            pipeline.rename(baseCounterKey, tmpCounterKey);
            pipeline.expire(tmpCounterKey, ttlSeconds);
        }
        if (bufferExists) {
            pipeline.rename(baseBufferKey, tmpBufferKey);
            pipeline.expire(tmpBufferKey, ttlSeconds);
        }
        await pipeline.exec();

        // Read data from isolated renamed keys
        const [counters, rawLogs] = await Promise.all([
            this.redis.hGetAll(tmpCounterKey),
            this.redis.lRange(tmpBufferKey, 0, -1),
        ]);

        // 1. Update aggregates



        const insertValues = {
            project_id: projectId,
            total_request: parseInt(counters["request"] || "0", 10),
            total_sent: parseInt(counters["sent"] || "0", 10),
            total_clicked: parseInt(counters["clicked"] || "0", 10),
            total_failed: parseInt(counters["failed"] || "0", 10),
            total_dropped: parseInt(counters["dropped"] || "0", 10),
            total_closed: parseInt(counters["closed"] || "0", 10),
        };

        // Use the QueryBuilder to perform the atomic UPSERT
         await this.notificationRepo
            .createQueryBuilder()
            .insert()
            .values(insertValues) // The values to be inserted
            .onConflict(`("project_id") DO UPDATE SET
        "total_request" = "notification"."total_request" + EXCLUDED."total_request",
        "total_sent" = "notification"."total_sent" + EXCLUDED."total_sent",
        "total_clicked" = "notification"."total_clicked" + EXCLUDED."total_clicked",
        "total_failed" = "notification"."total_failed" + EXCLUDED."total_failed",
        "total_dropped" = "notification"."total_dropped" + EXCLUDED."total_dropped",
        "total_closed" = "notification"."total_closed" + EXCLUDED."total_closed"
        `)
            .execute();

        // 2. Insert raw logs
        if (rawLogs.length > 0) {
            const logs = rawLogs.map((raw) => {
                const parsed = JSON.parse(raw);
                return this.notificationLogRepo.create({
                    notification_id: parsed.notificationId,
                    event: parsed.event,
                    type: parsed.type,
                    created_at: new Date(parsed.timestamp),
                    triggered_at: parsed.notificationId.split("-")[1],
                    // form_id: parsed.form_id,
                    // user_id: parsed.user_id,
                    // ip_address: parsed.ip_address,
                    // user_agent: parsed.user_agent,
                });
            });

            await this.notificationLogRepo.save(logs);
        }

        // 3. Final cleanup
        await Promise.all([
            this.redis.del(tmpCounterKey),
            this.redis.del(tmpBufferKey),
        ]);
    }
}
