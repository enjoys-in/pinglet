import os from "os";
import { Worker } from "bullmq";
import { QueueService } from ".";
import { QUEUE_NAME } from "./name";
import { __CONFIG__ } from "@/app/config";
import webpush from "web-push";
import { Cache } from "../redis/cacheService";
import { NotificationBody } from "@/utils/validators/notfication-send";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";
import { websiteService } from '../../../handlers/services/website.service';

export class ListenWorkers extends QueueService {
    static listen() {
        console.log("Listening to Queue");
        ListenWorkers.ProcessSendtoSocketNotification();
    }

    private static ProcessSendtoSocketNotification() {
        const worker = new Worker(
            QUEUE_NAME.SEND_BROWSER_NOTIFICATION,
            async (job) => {
                const { projectId, ...payload } = JSON.parse(job.data) as NotificationBody

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
                                const notificationPayload = JSON.stringify({
                                    title: payload?.data?.title || 'Default Title',
                                    body: payload?.data?.body || 'Default message body',
                                    icon: payload?.data?.icon || '/default-icon.png',
                                    badge: payload?.data?.badge || '/default-badge.png',
                                    tag: payload?.data?.tag || 'pinglet', // Prevents duplicate notifications
                                    requireInteraction: payload?.data?.requireInteraction || false, // Auto-dismiss after duration
                                    silent: payload?.data?.silent || false,
                                    // data: {
                                    //     url: '/', // URL to open when clicked
                                    //     duration: duration
                                    // },
                                    actions: [
                                        {
                                            action: 'view',
                                            title: 'View',
                                            icon: '/action-icon.png'
                                        },
                                        {
                                            action: 'dismiss',
                                            title: 'Dismiss'
                                        }
                                    ]
                                });
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
                        const notificationPayload = JSON.stringify({
                            title: 'Default Title',
                            body: 'Default message body',
                            icon: '/default-icon.png',
                            badge: '/default-badge.png',
                            tag: 'notification-tag', // Prevents duplicate notifications
                            requireInteraction: false, // Auto-dismiss after duration
                            silent: false,
                            // data: {
                            //     url: '/', // URL to open when clicked
                            //     duration: duration
                            // },
                            actions: [
                                {
                                    action: 'view',
                                    title: 'View',
                                    icon: '/action-icon.png'
                                },
                                {
                                    action: 'dismiss',
                                    title: 'Dismiss'
                                }
                            ]
                        });
                        return webpush.sendNotification(subscription, notificationPayload).then(res => {
                            // console.log('Notification sent successfully:', res);
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
        worker.on("completed", (job) => {
            console.log(`${job.id} has completed!`);
        });
        worker.on("error", (error: Error) => {
            console.log("error", error);
        });
        worker.on("failed", (job, err) => {
            console.log(`${job} has failed with ${err.message}`);
        });
    }
}