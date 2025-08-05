import { NotificationLogEntity } from "@/factory/entities/notifications-log.entity";
import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { InjectRepository } from "@/factory/typeorm";
import { ANALYTICS_EVENTS } from "@/utils/services/kafka/topics";
import { Cache } from "@/utils/services/redis/cacheService";
import { REDIS_KEYS_NAME } from "@/utils/services/redis/name";

import { Repository } from "typeorm";


class NotificationFlusherService {
    private readonly redis = Cache.cache;
    constructor(
        private readonly notificationRepo: Repository<NotificationEntity>,
        private readonly notificationLogRepo: Repository<NotificationLogEntity>) {
        this.notificationRepo = notificationRepo;
        this.notificationLogRepo = notificationLogRepo
    }

    async flushCounterData(baseCounterKeys: string[]): Promise<void> {
        if (baseCounterKeys.length === 0) return;

        for (const baseCounterKey of baseCounterKeys) {
            const projectId = baseCounterKey.replace(
                REDIS_KEYS_NAME.ANALYTICS_DELTA.replace('projectId', ''),
                ''
            );
            const timestamp = Date.now();
            const tmpCounterKey = `${baseCounterKey}:tmp:${timestamp}`;
            const ttlSeconds = 60 * 15;

            try {
                // Atomic Redis transaction
                const pipeline = this.redis.multi();
                const exists = await this.redis.exists(baseCounterKey);

                if (!exists) continue;

                pipeline.rename(baseCounterKey, tmpCounterKey);
                pipeline.expire(tmpCounterKey, ttlSeconds);
                await pipeline.exec();

                // Read counters
                const counters = await this.redis.hGetAll(tmpCounterKey);

                const insertValues = {
                    project_id: projectId,
                    total_request: parseInt(counters["request"] || "0", 10),
                    total_sent: parseInt(counters["sent"] || "0", 10),
                    total_clicked: parseInt(counters["clicked"] || "0", 10),
                    total_failed: parseInt(counters["failed"] || "0", 10),
                    total_dropped: parseInt(counters["dropped"] || "0", 10),
                    total_closed: parseInt(counters["closed"] || "0", 10),
                };

                // Use UPSERT with QueryBuilder (atomic upsert)
                await this.notificationRepo
                    .createQueryBuilder()
                    .insert()
                    .into(NotificationEntity, [
                        "project_id",
                        "total_request",
                        "total_sent",
                        "total_clicked",
                        "total_failed",
                        "total_dropped",
                        "total_closed"
                    ])
                    .values(insertValues)
                    .onConflict(`("project_id") DO UPDATE SET
                    "total_request" = "notifications"."total_request" + EXCLUDED."total_request",
                    "total_sent" = "notifications"."total_sent" + EXCLUDED."total_sent",
                    "total_clicked" = "notifications"."total_clicked" + EXCLUDED."total_clicked",
                    "total_failed" = "notifications"."total_failed" + EXCLUDED."total_failed",
                    "total_dropped" = "notifications"."total_dropped" + EXCLUDED."total_dropped",
                    "total_closed" = "notifications"."total_closed" + EXCLUDED."total_closed"
                `)
                    .execute();

                // ✅ Only delete Redis key if DB update was successful
                await this.redis.del(tmpCounterKey);
            } catch (err) {
                console.error(`[FlushCounter] Failed to flush counter for project ${projectId}:`, err);
                await this.redis.rPush(REDIS_KEYS_NAME.ANALYTICS_RETRY_DELTA, tmpCounterKey);
                await this.redis.expire(tmpCounterKey, 60 * 30);
                console.warn(`[Delta Counter] Moved ${tmpCounterKey} to retry queue`);
                // if (this.alertService) {
                //     this.alertService.notify({
                //         level: 'error',
                //         message: `FlushCounter failed for project ${projectId}`,
                //         context: { error: err, tmpKey: tmpCounterKey }
                //     });
                // }
            }
        }
    }

    async flushBufferData(baseBufferkeys: string[]): Promise<void> {

        if (baseBufferkeys.length === 0) return
        for (const baseBufferKey of baseBufferkeys) {
            const projectId = baseBufferKey.replace(
                REDIS_KEYS_NAME.ANALYTICS_BUFFER.replace('projectId', ''),
                ''
            );

            const tmpBufferKey = `${baseBufferKey}:tmp:${Date.now()}`;
            const ttlSeconds = 60 * 15;

            const pipeline = this.redis.multi();
            const bufferExists = await this.redis.exists(baseBufferKey);

            if (!bufferExists) continue;

            pipeline.rename(baseBufferKey, tmpBufferKey);
            pipeline.expire(tmpBufferKey, ttlSeconds);
            await pipeline.exec();

            const rawLogs = await this.redis.lRange(tmpBufferKey, 0, -1);
            if (rawLogs.length === 0) {
                await this.redis.del(tmpBufferKey);
                continue;
            }

            try {
                await this.notificationLogRepo.manager.transaction(async (tx) => {
                    const logs = rawLogs.map((raw) => {

                        const { notificationId, event, timestamp, type, ...metadata } = JSON.parse(raw);

                        return tx.create(this.notificationLogRepo.target, {
                            notification_id: notificationId,
                            project_id: projectId,
                            event: `notification.${event}` as ANALYTICS_EVENTS,
                            type,
                            created_at: new Date(timestamp),
                            triggered_at: notificationId.split("-")[1],
                            metadata
                        });
                    });

                    await tx.save(this.notificationLogRepo.target, logs);
                });

                // ✅ Only delete if DB transaction succeeded
                await this.redis.del(tmpBufferKey);

            } catch (err) {

                console.error(`[Buffer Counter] Failed to flush counter for project ${projectId}:`, err);
                await this.redis.rPush(REDIS_KEYS_NAME.ANALYTICS_RETRY_BUFFER, tmpBufferKey);
                await this.redis.expire(tmpBufferKey, 60 * 30);
                // if (this.alertService) {
                //     this.alertService.notify({
                //         level: 'error',
                //         message: `FlushCounter failed for project ${projectId}`,
                //         context: { error: err, tmpKey: tmpCounterKey }
                //     });
                // }
            }
        }



    }

    async fetchAllRegisteredProjects(): Promise<void> {
        const baseCounterKey = REDIS_KEYS_NAME.ANALYTICS_DELTA.replace('projectId', "*");
        const baseBufferKey = REDIS_KEYS_NAME.ANALYTICS_BUFFER.replace('projectId', "*");
        const baseCounterKeys = await this.redis.keys(baseCounterKey)
        const baseBufferkeys = await this.redis.keys(baseBufferKey)
        this.flushCounterData(baseCounterKeys)
        this.flushBufferData(baseBufferkeys)

    }
}

export const notificationFlusherService = new NotificationFlusherService(InjectRepository(NotificationEntity), InjectRepository(NotificationLogEntity));