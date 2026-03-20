import os from "node:os";
import { __CONFIG__ } from "@/app/config";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";
import { websiteService } from "@/handlers/services/website.service";
import type { NotificationBody } from "@/utils/validators/notfication-send";
import { Worker } from "bullmq";
import webpush from "web-push";
import { QueueService } from ".";
import { Cache } from "../redis/cacheService";
import { QUEUE_NAME } from "./name";

import { WebhookEvent, WebhookType } from "@/factory/entities/webhook.entity";
import { webhookService } from "@/handlers/services/webhook.service";
import { KafkaNotificationProducer } from "../kafka/producer";
import { AppEvents } from "@/utils/services/Events";
import { NotificationLifecycleEvent } from "@/utils/services/kafka/topics";
import { executeFlow } from "../flow-engine";
const kafkaProducer = new KafkaNotificationProducer([
	`${__CONFIG__.KAFKA.KAFKA_HOST}:${__CONFIG__.KAFKA.KAFKA_PORT}`,
]);

export class ListenWorkers extends QueueService {
	private static workers: Worker[] = [];

	static listen() {
		console.log("Listening to Queue");
		kafkaProducer.connect();

		ListenWorkers.ProcessSendtoSocketNotification();
		ListenWorkers.ProcessSendtoKafka();
		ListenWorkers.ProcessTriggerWebhook();
		ListenWorkers.ProcessExecuteFlow();
	}

	static async closeAll(): Promise<void> {
		await Promise.allSettled(ListenWorkers.workers.map((w) => w.close()));
		await kafkaProducer.disconnect().catch(() => {});
	}
	private static ProcessSendtoKafka() {
		const worker = new Worker(
			QUEUE_NAME.SEND_KAFKA_NOTIFICATION,
			async (job) => {
				const { project_id, timestamp, type, event, notification_id } =
					job.data as {
						project_id: string;
						timestamp: number;
						type: "0" | "1" | "-1";
						event: string;
						notification_id?: string;
					};
				await kafkaProducer.sendEvent("notification-events", {
					event,
					timestamp,
					type,
					projectId: project_id,
					notificationId: notification_id || `${project_id}-${timestamp}`,
				});
			},
			{
				connection: ListenWorkers.connection,
				useWorkerThreads: true,
				concurrency: os.cpus().length,
			},
		);
		ListenWorkers.workers.push(worker);
		worker.on("completed", async (job) => {
			console.log(`Sent to Kafka ${job.id}`);
		});
		worker.on("error", async (error: Error) => {
			console.log("error", error);
		});
	}
	private static ProcessSendtoSocketNotification() {
		const worker = new Worker(
			QUEUE_NAME.SEND_BROWSER_NOTIFICATION,
			async (job) => {
				const { projectId, ...payload } = JSON.parse(
					job.data,
				) as NotificationBody;

				if (payload?.data?.data) {
					(payload.data.data as any).project_id = projectId;
					(payload.data.data as any).type = payload.type;
				} else {
					(payload.data as any) = {
						data: {
							project_id: projectId,
							type: payload.type,
						},
					};
				}

				const notificationPayload = JSON.stringify(
					Object.assign(
						{},
						payload.data,
						payload.data?.icon && { icon: payload.data?.icon },
						payload.data?.badge && { badge: payload.data?.badge },
						payload.data?.image && { image: payload.data?.image },
					),
				);

				try {
					const value = await Cache.cache.get(`${projectId}-notification`);

					if (!value) {
						const sub =
							await pushSubscriptionService.getSubscriptionsByProjectId(
								projectId,
								["endpoint", "keys", "id"],
							);

						if (sub) {
							const getWebsite = await websiteService.getWebsiteWithOptions({
								where: {
									projects: {
										unique_id: projectId,
									},
								},
								select: {
									pinglet_id: true,
									id: true,
								},
							});

							if (!getWebsite) {
								throw new Error("Website not found");
							}

							webpush.setVapidDetails(
								`mailto:${process.env.VAPID_MAILTO || "admin@pinglet.enjoys.in"}`,
								getWebsite.pinglet_id.publicKey,
								getWebsite.pinglet_id.privateKey,
							);
							const promises = sub.map((item) => {
								const subscription = {
									endpoint: item.endpoint,
									keys: item.keys,
								};

								return webpush
									.sendNotification(subscription, notificationPayload)
									.then((res) => {
										// console.log('Notification sent successfully:', res);
									})
									.catch((err) => {
										console.error("Error sending notification:", err);
									});
							});

							await Promise.all(promises);

							const cachePayload = {
								vapidKeys: {
									publicKey: getWebsite.pinglet_id.publicKey,
									privateKey: getWebsite.pinglet_id.privateKey,
								},
								subcription: sub,
							};
							Cache.cache.set(
								`${projectId}-notification`,
								JSON.stringify(cachePayload),
								{
									EX: 86400,
								},
							);
						}
						return;
					}
					const parsedValue = JSON.parse(value) as {
						vapidKeys: {
							publicKey: string;
							privateKey: string;
						};
						subcription: {
							endpoint: string;
							keys: { p256dh: string; auth: string };
						}[];
					};
					webpush.setVapidDetails(
						`mailto:${process.env.VAPID_MAILTO || "admin@pinglet.enjoys.in"}`,
						parsedValue.vapidKeys.publicKey,
						parsedValue.vapidKeys.privateKey,
					);
					parsedValue.subcription.map((item) => {
						const subscription = {
							endpoint: item.endpoint,
							keys: item.keys,
						};

						return webpush
							.sendNotification(subscription, notificationPayload)
							.then((res) => {
								console.log("Notification sent successfully:", res.statusCode);
							})
							.catch((err) => {
								console.error("Error sending notification:", err);
							});
					});
				} catch (error) {
					console.error("Error:", error);
				}
			},
			{
				connection: ListenWorkers.connection,
				useWorkerThreads: true,
				concurrency: os.cpus().length,
			},
		);
		ListenWorkers.workers.push(worker);
		ListenWorkers.workerEventListener(worker);
	}
	private static workerEventListener(worker: Worker) {
		worker.on("completed", async (job) => {
			const p = JSON.parse(job.data);
			AppEvents.emit("notificationLifecycle", {
				event: NotificationLifecycleEvent.SENT,
				projectId: p?.projectId,
				type: p.type || "-1",
				notificationId: job.id!,
				data: p,
			});
		});
		worker.on("error", async (error: Error) => {
			console.log("error", error);
		});
		worker.on("failed", async (job, err) => {
			console.log(`${job} has failed with ${err.message}`);
			const p = JSON.parse(job?.data);
			AppEvents.emit("notificationLifecycle", {
				event: NotificationLifecycleEvent.FAILED,
				projectId: p?.projectId,
				type: p.type || "-1",
				notificationId: job?.id!,
				data: p,
			});
		});
	}
	private static ProcessTriggerWebhook() {
		const worker = new Worker(
			QUEUE_NAME.TRIGGER_WEBHOOK,
			async (job) => {
				const {
					webhookId,
					webhookType,
					event,
					config,
					projectId,
					notificationType,
					notificationData,
					timestamp,
				} = job.data as {
					webhookId: number;
					webhookType: string;
					event: WebhookEvent;
					config: Record<string, any>;
					projectId: string;
					notificationType: "1" | "0" | "-1";
					notificationData: Record<string, any>;
					timestamp: number;
				};

				const payload = {
					event,
					projectId,
					notificationType,
					notificationData,
					timestamp,
				};

				try {
					switch (webhookType) {
						case WebhookType.API: {
							const url = config?.api?.url;
							if (!url) { console.warn(`Webhook ${webhookId} skipped — API URL not configured`); return; }
							const resp = await fetch(url, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify(payload),
								signal: AbortSignal.timeout(10000),
							});
							if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
							break;
						}
						case WebhookType.TELEGRAM: {
							const botToken = config?.telegram?.botToken;
							const chatId = config?.telegram?.chatId;
							if (!botToken || !chatId) { console.warn(`Webhook ${webhookId} skipped — Telegram config missing`); return; }
							const text = `*${event}*\nProject: ${projectId}\nType: ${notificationType}\nTime: ${new Date(timestamp).toISOString()}`;
							const resp = await fetch(
								`https://api.telegram.org/bot${encodeURIComponent(botToken)}/sendMessage`,
								{
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
									signal: AbortSignal.timeout(10000),
								},
							);
							if (!resp.ok) throw new Error(`Telegram API ${resp.status}`);
							break;
						}
						case WebhookType.SLACK: {
							const url = config?.slack?.url;
							if (!url) { console.warn(`Webhook ${webhookId} skipped — Slack URL not configured`); return; }
							const resp = await fetch(url, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									text: `[${event}] Project: ${projectId} | Type: ${notificationType} | ${new Date(timestamp).toISOString()}`,
								}),
								signal: AbortSignal.timeout(10000),
							});
							if (!resp.ok) throw new Error(`Slack ${resp.status}`);
							break;
						}
						case WebhookType.DISCORD: {
							const url = config?.discord?.url;
							if (!url) { console.warn(`Webhook ${webhookId} skipped — Discord URL not configured`); return; }
							const resp = await fetch(url, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									content: `**${event}**\nProject: ${projectId}\nType: ${notificationType}\nTime: ${new Date(timestamp).toISOString()}`,
								}),
								signal: AbortSignal.timeout(10000),
							});
							if (!resp.ok) throw new Error(`Discord ${resp.status}`);
							break;
						}
						case WebhookType.TEAMS: {
							const url = config?.teams?.url;
							if (!url) { console.warn(`Webhook ${webhookId} skipped — Teams URL not configured`); return; }
							const resp = await fetch(url, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({
									text: `**${event}** | Project: ${projectId} | Type: ${notificationType} | ${new Date(timestamp).toISOString()}`,
								}),
								signal: AbortSignal.timeout(10000),
							});
							if (!resp.ok) throw new Error(`Teams ${resp.status}`);
							break;
						}
						default:
							console.warn(`Webhook ${webhookId} skipped — unsupported type: ${webhookType}`);
							return;
					}
					await webhookService.recordSuccess(webhookId);
				} catch (err) {
					console.error(`Webhook ${webhookId} dispatch failed:`, err);
					await webhookService.recordFailure(webhookId);
					throw err;
				}
			},
			{
				connection: ListenWorkers.connection,
				useWorkerThreads: true,
				concurrency: os.cpus().length,
			},
		);
		worker.on("completed", async (job) => {
			console.log(`Webhook job ${job.id} completed`);
		});
		worker.on("error", async (error: Error) => {
			console.log("Webhook worker error:", error);
		});
		ListenWorkers.workers.push(worker);
	}

	// ── Worker 4: EXECUTE_FLOW (async flow graph execution) ──
	private static ProcessExecuteFlow() {
		const worker = new Worker(
			QUEUE_NAME.EXECUTE_FLOW,
			async (job) => {
				await executeFlow(job.data);
			},
			{
				connection: ListenWorkers.connection,
				useWorkerThreads: true,
				concurrency: os.cpus().length,
			},
		);
		worker.on("completed", async (job) => {
			console.log(`Flow execution ${job.id} completed`);
		});
		worker.on("failed", async (job, err) => {
			console.error(`Flow execution ${job?.id} failed:`, err.message);
		});
		worker.on("error", async (error: Error) => {
			console.error("Flow worker error:", error);
		});
		ListenWorkers.workers.push(worker);
	}
}
