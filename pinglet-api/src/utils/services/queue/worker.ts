import os from "os";
import { Worker } from "bullmq";
import { QueueService } from ".";
import { QUEUE_NAME } from "./name";
import { __CONFIG__ } from "@/app/config";
import webpush from "web-push";
import { Cache } from "../redis/cacheService";
import { NotificationBody } from "@/utils/validators/notfication-send";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";
import { websiteService } from '@/handlers/services/website.service';

import { KafkaNotificationProducer } from "../kafka/producer";
import { KafkaNotificationLogger } from "../kafka/notificationLogger";
const kafkaProducer = new KafkaNotificationProducer([`${__CONFIG__.KAFKA.KAFKA_HOST}:${__CONFIG__.KAFKA.KAFKA_PORT}`]);
const logger = new KafkaNotificationLogger(kafkaProducer, "notification-events");

export class ListenWorkers extends QueueService {
    static listen() {
        console.log("Listening to Queue");
        kafkaProducer.connect();

        ListenWorkers.ProcessSendtoSocketNotification();
        ListenWorkers.ProcessSendtoKafka();
    }
    private static ProcessSendtoKafka() {
        const worker = new Worker(
            QUEUE_NAME.SEND_KAFKA_NOTIFICATION,
            async (job) => {
                const { project_id, timestamp, type, event, ...metadata } = job.data as {
                    project_id: string
                    timestamp: number
                    type: "0" | "1" | "-1"
                    event: 'clicked' | 'dropped' | 'closed'
                } & Record<string, any> & {}
                await logger.log({
                    event,
                    timestamp,
                    type,
                    projectId: project_id,
                    notificationId: `${project_id}-${timestamp}`,
                    metadata
                });
            }, {
            connection: ListenWorkers.connection,
            useWorkerThreads: true,
            concurrency: os.cpus().length,
        }
        )
        worker.on("completed", async (job) => {
            console.log("Sent to Kafka " + job.id);
        });
        worker.on("error", async (error: Error) => {
            console.log("error", error);
        })
    }
    private static ProcessSendtoSocketNotification() {

        const worker = new Worker(
            QUEUE_NAME.SEND_BROWSER_NOTIFICATION,
            async (job) => {
                const { projectId, ...payload } = JSON.parse(job.data) as NotificationBody

                if (payload?.data?.data) {
                    (payload.data.data as any)["project_id"] = projectId;
                    (payload.data.data as any)["type"] = payload.type;
                } else {
                    (payload.data as any) = {
                        data: {
                            project_id: projectId,
                            type: payload.type,
                        }
                    };
                }


                const notificationPayload = JSON.stringify(Object.assign({}, payload.data,
                    payload.data?.icon && { icon: payload.data?.icon },
                    payload.data?.badge && { badge: payload.data?.badge },
                    payload.data?.image && { image: payload.data?.image },

                ));

                try {
                    const value = await Cache.cache.get(`${projectId}-notification`)


                    if (!value) {
                        const sub = await pushSubscriptionService.getSubscriptionsByProjectId(
                            projectId,
                            ["endpoint", "keys", "id"]
                        )


                        if (sub) {
                            const getWebsite = await websiteService.getWebsiteWithOptions({
                                where: {
                                    projects: {
                                        unique_id: projectId
                                    }
                                },
                                select: {
                                    pinglet_id: true,
                                    id: true
                                }
                            })

                            if (!getWebsite) {
                                throw new Error("Website not found")
                            }

                            webpush.setVapidDetails(
                                "mailto:mullayam06@outlook.com",
                                getWebsite.pinglet_id.publicKey,
                                getWebsite.pinglet_id.privateKey
                            );
                            const promises = sub.map(item => {
                                const subscription = {
                                    endpoint: item.endpoint,
                                    keys: item.keys
                                }

                                return webpush.sendNotification(subscription, notificationPayload).then(res => {
                                    // console.log('Notification sent successfully:', res);
                                })
                                    .catch(err => {
                                        console.error('Error sending notification:', err);

                                    });
                            });

                            await Promise.all(promises);


                            const cachePayload = {
                                vapidKeys: {
                                    publicKey: getWebsite.pinglet_id.publicKey,
                                    privateKey: getWebsite.pinglet_id.privateKey
                                },
                                subcription: sub
                            }
                            Cache.cache.set(`${projectId}-notification`, JSON.stringify(cachePayload), {
                                EX: 86400
                            });
                        }
                        return
                    }
                    const parsedValue = JSON.parse(value) as {
                        vapidKeys: {
                            publicKey: string,
                            privateKey: string
                        },
                        subcription: { endpoint: string, keys: { p256dh: string, auth: string } }[]
                    }
                    webpush.setVapidDetails(
                        "mailto:mullayam06@outlook.com",
                        parsedValue.vapidKeys.publicKey,
                        parsedValue.vapidKeys.privateKey
                    );
                    parsedValue.subcription.map((item) => {
                        const subscription = {
                            endpoint: item.endpoint,
                            keys: item.keys
                        }

                        return webpush.sendNotification(subscription, notificationPayload).then(res => {
                            console.log('Notification sent successfully:', res.statusCode);
                        })
                            .catch(err => {
                                console.error('Error sending notification:', err);
                            })

                    })
                } catch (error) {
                    console.error('Error:', error);
                }
            },
            {
                connection: ListenWorkers.connection,
                useWorkerThreads: true,
                concurrency: os.cpus().length,
            }
        );
        ListenWorkers.workerEventListener(worker);
    }
    private static workerEventListener(worker: Worker) {
        worker.on("completed", async (job) => {
            await logger.log({
                event: "sent",
                timestamp: Date.now(),
                type: job.data.type,
                projectId: job.data.projectId,
                notificationId: job.id!,
                metadata: job.data
            });
        });
        worker.on("error", async (error: Error) => {
            console.log("error", error);

        });
        worker.on("failed", async (job, err) => {
            console.log(`${job} has failed with ${err.message}`);
            await logger.log({
                event: "failed",
                timestamp: Date.now(),
                type: job?.data.type,
                projectId: job?.data.projectId,
                notificationId: job?.id!,
                metadata: job?.data
            });
        });
    }
}