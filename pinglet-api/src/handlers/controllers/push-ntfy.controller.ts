import { createReadStream, readFile } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { planService } from "../services/plan.service";
import { projectService } from "../services/project.service";

import { WebhookEvent, WebhookType } from "@/factory/entities/webhook.entity";
import {
	DEFAULT_WIDGET_TEMPLATE,
	WidgetErrorTemplate,
} from "@/factory/templates/widget.template";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";
import { notificationInboxService } from "@/handlers/services/notification-inbox.service";
import { isInQuietHours } from "@/handlers/services/notification-guards.service";
import { livePresenceService } from "@/handlers/services/live-presence.service";
import { unsubscribeAnalyticsService } from "@/handlers/services/unsubscribe-analytics.service";
import { AppEvents } from "@/utils/services/Events";
import { QueueService } from "@/utils/services/queue";
import { QUEUE_JOBS } from "@/utils/services/queue/name";
import { Cache } from "@/utils/services/redis/cacheService";
import {
	type NotificationBody,
	notificationSchema,
} from "@/utils/validators/notfication-send";
import { In } from "typeorm";
import { DEFAULT_SW_FILE_CONTENT } from "../services/default/swFileContent";
import { KafkaAnalyticsConsumer } from "../services/kafka/notificationConsumer";
import { templateService } from "../services/template.service";
import { WidgetService } from "../services/widget.service";

const clients = new Map<string, Set<Response>>();

const sendPushQueue = QueueService.createQueue("SEND_BROWSER_NOTIFICATION");
const sendToKafkaQueue = QueueService.createQueue("SEND_KAFKA_NOTIFICATION");

new KafkaAnalyticsConsumer().start();
let base64Mp3: string | null = null;

class PushNtfyController {
	logEvent = async (req: Request, res: Response) => {
		const body = req.body;
		sendToKafkaQueue.add(QUEUE_JOBS.SEND_KAFKA_NOTIFICATION, body, {
			removeOnComplete: true,
			jobId: `${body.project_id}-${body.timestamp}-${body.event}`,
		});
		AppEvents.emit(
			"triggerWebhook",
			JSON.stringify({
				webhookType: WebhookType.API,
				event: body?.event,
				projectId: body?.project_id,
				notificationType: body?.type,
				notificationData: body,
				timestamp: body?.timestamp,
			}),
		);
		res.end();
	};
	loadConfig = async (req: Request, res: Response) => {
		try {
			const query = req.query as { projectId: string; domain: string };

			if (!query.projectId || !query.domain) {
				throw new Error("Missing projectIds or domain");
			}
			const cacheKey = `${query.projectId}-${query.domain}`;
			const cache = await Cache.cache.get(cacheKey);
			if (cache) {
				res
					.json({ message: "OK", result: JSON.parse(cache), success: true })
					.end();
				return;
			}
			const key = req.headers["x-pinglet-checksum"] as string;
			const configuredDomain = query.domain;
			const project =
				await projectService.getProjectsByWebsite(configuredDomain);
			if (!project) {
				throw new Error("Project not found for the given domain");
			}

			// const keyBuffer = Buffer.from(key, 'base64').toString("base64").slice(0, 32)
			// const iv = Buffer.from(query.projectId, 'hex')
			// const { tag, encrypted } = encryptToString(JSON.stringify({ is_premium: false }), keyBuffer, iv)

			const loadConfig = await projectService.getSelectedProjects({
				where: { unique_id: query.projectId, is_active: true },
				select: {
					id: true,
					config: true,
					user: { id: true },
					category: {
						id: true,
						templates: {
							id: true,
							compiled_text: true,
							config: true,
							is_active: true,
							is_default: true,
						},
					},
				},
				relations: {
					user: true,
					category: {
						templates: true,
					},
				},
			});
			if (!loadConfig) {
				throw new Error("No projects found for the given IDs");
			}

			// White-label enforcement: force branding for non-Enterprise users
			const config = { ...loadConfig.config };
			if (loadConfig.user?.id) {
				const hasWhiteLabel = await planService.hasFeature(loadConfig.user.id, "white_label");
				if (!hasWhiteLabel && config.branding) {
					config.branding = { ...config.branding, show: true };
				}
			}

			const result = loadConfig.category.templates.filter(
				(t) => t.is_active && t.is_default,
			);

			const obj = {
				config,
				template: result[0] || null,
				// tag,
				// pid: encrypted
			};
			Cache.cache.set(String(cacheKey), JSON.stringify(obj), {
				EX: 60 * 60 * 24,
			});
			res.json({ message: "OK", result: obj, success: true }).end();
			return;
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	};
	loadTemplates = async (req: Request, res: Response) => {
		try {
			const query = req.query as { projectId: string; templatesIds: string };
			 
			if (!query.projectId ) {
				throw new Error("Missing projectId or templatesIds");
			}
			if (!query.templatesIds ) {
				 
				return res.json({ message: "OK", result: {}, success: true }).end();
			}
			const duplicationKey = Buffer.from(
				`${query.projectId}-${query.templatesIds}`,
			).toString("base64");

			const cache = await Cache.cache.get(duplicationKey);
			if (cache) {
				res
					.json({ message: "OK", result: JSON.parse(cache), success: true })
					.end();
				return;
			}

			const loadConfig = await projectService.getSelectedProjects({
				where: {
					unique_id: query.projectId,
					is_active: true,
					category: {
						templates: {
							id: In(query.templatesIds.split(",")),
						},
					},
				},
				select: {
					id: true,
					config: true,
					category: {
						id: true,
						templates: {
							id: true,
							compiled_text: true,
							config: true,
							is_active: true,
							is_default: true,
						},
					},
				},
				relations: {
					category: {
						templates: true,
					},
				},
			});
			if (!loadConfig) {
				throw new Error("No projects found for the given IDs");
			}
			const templates = Object.fromEntries(
				loadConfig.category.templates.map((t) => [String(t.id), t]),
			);

			await Cache.cache.set(String(duplicationKey), JSON.stringify(templates), {
				EX: 60 * 60 * 24,
			});
			res.json({ message: "OK", result: templates, success: true }).end();
			return;
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	};
	subscribeNotificatons = async (req: Request, res: Response) => {
		try {
			const projectId = req.query?.projectId as string;

			if (!projectId) {
				res.status(400).send("Missing projectId");
				return;
			}

			// --- Plan feature gate: browser_notifications ---
			const project = await projectService.getSelectedProjects({
				where: { unique_id: projectId },
				select: { id: true, user: { id: true } },
				relations: { user: true },
			});
			if (project?.user?.id) {
				const allowed = await planService.hasFeature(project.user.id, "browser_notifications");
				if (!allowed) {
					res.status(403).json({
						message: "Browser notifications are not available on your current plan",
						result: null,
						success: false,
					}).end();
					return;
				}
			}

			const ua = req.headers["user-agent"] || "";
			await pushSubscriptionService.handleSubscription({
				project_id: projectId,
				info: ua,
				...req.body,
			});
			AppEvents.emit(
				"triggerWebhook",
				JSON.stringify({
					webhookType: WebhookType.API,
					event: WebhookEvent.USER_SUBSCRIBED,
					projectId: projectId,
					userId: project?.user?.id,
					notificationType: "-1",
					notificationData: null,
					timestamp: Date.now(),
				}),
			);
			res
				.json({
					message: "OK",
					result: null,
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	};
	unsubscribeNotificatons = async (req: Request, res: Response) => {
		try {
			const body = req.body;
			await pushSubscriptionService.deleteSubscription(
				body.endpoint,
				body.projectId,
			);
			// Log unsubscribe reason for analytics
			unsubscribeAnalyticsService.logUnsubscribe({
				project_id: body.projectId,
				endpoint: body.endpoint,
				reason: body.reason || null,
				feedback: body.feedback || null,
				user_agent: req.headers["user-agent"] || "",
			}).catch(() => {});
			AppEvents.emit(
				"triggerWebhook",
				JSON.stringify({
					webhookType: WebhookType.API,
					event: WebhookEvent.USER_UNSUBSCRIBED,
					projectId: body.projectId,
					notificationType: "-1",
					notificationData: null,
					timestamp: Date.now(),
				}),
			);
			res
				.json({
					message: "OK",
					result: null,
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	};
	customNotificatons = async (req: Request, res: Response) => {
		const projectId = req.query?.projectId as string;
		if (!projectId) {
			res.status(400).send("Missing projectId");
			return;
		}
		req.socket.setTimeout(0);
		res.writeHead(200, {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		});

		res.write("\n");
		if (!clients.has(projectId)) clients.set(projectId, new Set());
		clients.get(projectId)?.add(res);

		// Track live presence
		const connectionId = `${projectId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
		livePresenceService.connect(projectId, connectionId).catch(() => {});

		// Heartbeat to keep presence alive
		const heartbeatInterval = setInterval(() => {
			res.write(":heartbeat\n\n");
			livePresenceService.heartbeat(projectId, connectionId).catch(() => {});
		}, 30_000);

		req.on("close", () => {
			clients.get(projectId)?.delete(res);
			clearInterval(heartbeatInterval);
			livePresenceService.disconnect(projectId, connectionId).catch(() => {});
		});
	};
	triggerNotification = async (
		req: Request<{}, {}, NotificationBody, {}>,
		res: Response,
	) => {
		try {
			const parsed = notificationSchema.safeParse(req.body);

			if (!parsed.success) {
				res
					.status(400)
					.json({
						message: "Bad Request. Invalid Payload",
						result: parsed.error.format(),
						success: false,
					})
					.end();

				return;
			}
			const { projectId, ...rest } = req.body;

			// --- Plan quota enforcement (notification send limit) ---
			const project = await projectService.getSelectedProjects({
				where: { unique_id: projectId },
				select: { id: true, user: { id: true }, quiet_hours: true, rate_limit: true },
				relations: { user: true },
			});

			// --- Quiet hours check ---
			if (project && isInQuietHours((project as any).quiet_hours)) {
				res.status(429).json({
					message: "Notifications are paused during quiet hours",
					result: null,
					success: false,
				}).end();
				return;
			}

			if (project?.user?.id) {
				// Single consolidated check: plan type (1 DB call) + quota (Redis-cached) + feature flags (in-memory)
				const featuresToCheck: Array<"white_label" | "media_audio_video"> = [];
				if (rest.overrides?.branding) featuresToCheck.push("white_label");
				const mediaType = rest.body?.media?.type;
				if (mediaType === "audio" || mediaType === "video") featuresToCheck.push("media_audio_video");

				const { quota, features } = await planService.checkSendPermissions(project.user.id, featuresToCheck);

				if (!quota.allowed) {
					res
						.status(403)
						.json({
							message: "Monthly notification limit reached for your plan",
							result: { current: quota.current, max: quota.max },
							success: false,
						})
						.end();
					return;
				}

				if (rest.overrides?.branding && !features.white_label) {
					res.status(403).json({
						message: "Branding customization requires an Enterprise plan",
						result: null,
						success: false,
					}).end();
					return;
				}

				if ((mediaType === "audio" || mediaType === "video") && !features.media_audio_video) {
					res.status(403).json({
						message: "Audio and video media require a Professional or Enterprise plan",
						result: null,
						success: false,
					}).end();
					return;
				}
			}

			if (projectId && rest.type === "-1" && rest?.data) {
				sendPushQueue.add(
					"send-browser-notification",
					JSON.stringify(req.body),
					{
						jobId: `${projectId}-${Date.now()}`,
						removeOnComplete: true,
						removeOnFail: true,
					},
				);
				res.setHeader("Content-Security-Policy", "img-src * data: 'self';");
				res.setHeader("X-Content-Type-Options", "nosniff");
				res.setHeader("X-Notification-Type", "push");
				res
					.json({
						message: "OK",
						result: "Notification Sent",
						success: true,
					})
					.end();
				AppEvents.emit(
					"triggerWebhook",
					JSON.stringify({
						webhookType: WebhookType.API,
						event: WebhookEvent.NOTIFICATION_SENT,
						projectId: projectId,
						userId: project?.user?.id,
						notificationType: rest.type,
						notificationData: rest,
						timestamp: Date.now(),
					}),
				);
				return;
			}
			res.setHeader("X-Notification-Type", "custom");

			const payload = JSON.stringify(req.body);
			clients.get(projectId)?.forEach((client) => {
				client.write(`data: ${payload}\n\n`);
			});

			// Store in notification inbox for persistent feed
			notificationInboxService.addToInbox({
				project_id: projectId,
				title: rest.data?.title || rest.body?.title || "Notification",
				body: rest.data?.body || rest.body?.description || "",
				icon: rest.data?.icon || rest.body?.icon || "",
				image: rest.data?.image || "",
				url: rest.body?.url || "",
				type: rest.type || "0",
				data: rest.data || rest.body || {},
			}).catch(() => {});

			AppEvents.emit(
				"triggerWebhook",
				JSON.stringify({
					webhookType: WebhookType.API,
					event: WebhookEvent.NOTIFICATION_SENT,
					projectId: projectId,
					userId: project?.user?.id,
					notificationType: rest.type,
					notificationData: rest,
					timestamp: Date.now(),
				}),
			);
			res
				.json({
					message: "OK",
					result: "Notification Sent",
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	};

	sound = async (req: Request, res: Response) => {
		const ext = req.query?.ext as string;
		const filePath = path.join(process.cwd(), "public", "pinglet-sound.mp3");
		if (ext === "mp3") {
			res.setHeader("Content-Type", "audio/mp3");
			res.setHeader(
				"Content-Disposition",
				"inline; filename=pinglet-sound.mp3",
			);
			res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
			res.setHeader("Content-Type", "audio/mpeg");
			createReadStream(filePath).pipe(res);
		} else {
			res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache

			if (base64Mp3) {
				res.send(`data:audio/mp3;base64,${base64Mp3}`);
				return;
			}

			readFile(filePath, (err, data) => {
				if (err) return res.status(500).send("Error reading file");
				base64Mp3 = data.toString("base64");
				res.send(`data:audio/mp3;base64,${base64Mp3}`);
			});
		}
	};
	swJSFile = async (req: Request, res: Response) => {
		// const ty = readFileSync(join(process.cwd(), "public", "scripts", "v0.0.2", "sw.js"), "utf-8")
		res.set("Content-Type", "application/javascript");
		res.set(
			"Cache-Control",
			"no-store, no-cache, must-revalidate, proxy-revalidate",
		);
		res.set("Pragma", "no-cache");
		res.set("Expires", "0");
		res.send(DEFAULT_SW_FILE_CONTENT);
	};
	loadWidgetJsV1File = async (req: Request, res: Response) => {
		const wid = req.params.wid;
		const prebuilt = req.query?.prebuilt as string;
		res.set("Content-Type", "application/javascript");
		if (!wid) {
			res.send(WidgetErrorTemplate("Widget ID is required"));
			return;
		}
		const cachedValue = await Cache.cache.get(wid);
		if (!cachedValue) {
			const widget = await WidgetService.getWidgetByWidgetId(wid);
			if (!widget) {
				res.send(WidgetErrorTemplate("Invalid Widget ID"));
				return;
			}
			Cache.cache.set(
				wid,
				JSON.stringify({
					data: widget.data,
					style_props: widget.style_props,
				}),
				{ EX: 60 * 60 * 24 },
			);
			res.send(
				DEFAULT_WIDGET_TEMPLATE(
					req.params.wid,
					widget.data.text,
					widget.data.description,
					widget.data.buttonText,
					widget.data.link,
					widget.data.imagePreview,
				),
			);
			return;
		}

		const widget = JSON.parse(cachedValue);
		res.set("Content-Type", "application/javascript");
		res.send(
			DEFAULT_WIDGET_TEMPLATE(
				req.params.wid,
				widget.data.text,
				widget.data.description,
				widget.data.buttonText,
				widget.data.link,
				widget.data.imagePreview,
			),
		);
	};

	loadWidgetJsV2File = async (req: Request, res: Response) => {
		const wid = req.params.wid;
		res.set("Content-Type", "application/javascript");
		if (!wid) {
			res.send(WidgetErrorTemplate("Widget ID is required"));
			return;
		}
		const cachedValue = await Cache.cache.get(wid);
		if (!cachedValue) {
			const widget = await WidgetService.getWidgetByWidgetId(wid);
			if (!widget) {
				res.send(WidgetErrorTemplate("Invalid Widget ID"));
				return;
			}
			Cache.cache.set(
				wid,
				JSON.stringify({
					data: widget.data,
					style_props: widget.style_props,
				}),
				{ EX: 60 * 60 * 24 },
			);
			res.send(
				`const element = [document.createElement("p")];element[0].innerText = "Right side notification!";`,
			);
			return;
		}

		const widget = JSON.parse(cachedValue);
		res.set("Content-Type", "application/javascript");
		res.send(
			`const element = [document.createElement("p")];element[0].innerText = "Right side notification!";`,
		);
	};

	/**
	 * GET /api/v1/inbox?projectId=xxx&subscriberId=yyy — public endpoint for SDK bell widget
	 */
	getPublicInbox = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const subscriberId = req.query.subscriberId ? Number(req.query.subscriberId) : undefined;
			const limit = Math.min(Number(req.query.limit) || 20, 50);
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}
			const items = await notificationInboxService.getInbox(projectId, subscriberId, limit, 0);
			const unreadCount = await notificationInboxService.getUnreadCount(projectId, subscriberId);
			res.json({ message: "OK", success: true, result: { items, unreadCount } });
		} catch (error) {
			res.json({ message: "Failed to get inbox", success: false }).end();
		}
	};
}

export default new PushNtfyController();
