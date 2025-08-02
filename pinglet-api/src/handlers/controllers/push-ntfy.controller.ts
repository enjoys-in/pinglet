import { createReadStream, readFile } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { projectService } from "../services/project.service";

import { Cache } from "@/utils/services/redis/cacheService";
import { NotificationBody, notificationSchema } from "@/utils/validators/notfication-send";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";
import { DEFAULT_WIDGET_TEMPLATE, WidgetErrorTemplate } from "@/factory/templates/widget.template";
import { WidgetService } from "../services/widget.service";
import { QueueService } from "@/utils/services/queue";
import { ListenWorkers } from "@/utils/services/queue/worker";
import webpush from 'web-push';
const clients = new Map<string, Set<Response>>();

const sendPushQueue = QueueService.createQueue("SEND_BROWSER_NOTIFICATION")

ListenWorkers.listen();
let base64Mp3: string | null = null;
class PushNtfyController {

	loadConfig = async (req: Request, res: Response) => {
		try {
			const query = req.query as { projectId: string, domain: string };

			if (!query.projectId || !query.domain) {
				throw new Error("Missing projectIds or domain");
			}
			const cacheKey = `${query.projectId}-${query.domain}`
			const cache = await Cache.cache.get(cacheKey)
			if (cache) {
				res
					.json({ message: "OK", result: JSON.parse(cache), success: true })
					.end();
				return;
			}
			const key = req.headers["x-pinglet-checksum"] as string
			const configuredDomain = query.domain;
			const project = await projectService.getProjectsByWebsite(configuredDomain);
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
					category: {
						id: true,
						templates: {
							id: true,
							compiled_text: true,
							config: true,
							is_active: true,
							is_default: true,
						},
					}
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
			const result = loadConfig.category.templates.filter(t => t.is_active && t.is_default)

			const obj = {
				config: loadConfig.config,
				template: result[0] || null,
				// tag,
				// pid: encrypted
			}
			Cache.cache.set(String(cacheKey), JSON.stringify(obj), {
				EX: 60 * 60 * 24
			})
			res
				.json({ message: "OK", result: obj, success: true })
				.end();
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
			const query = req.query as { projectId: string };

			if (!query.projectId) {
				throw new Error("Missing projectIds or domain");
			}
			const cacheKey = `${query.projectId}-templates`
			const cache = await Cache.cache.get(cacheKey)
			if (cache) {
				res
					.json({ message: "OK", result: JSON.parse(cache), success: true })
					.end();
				return;
			}
			const loadConfig = await projectService.getSelectedProjects({
				where: { unique_id: query.projectId, is_active: true },
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
					}
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
				loadConfig.category.templates.map(t => [String(t.id), t])
			);

			await Cache.cache.set(String(cacheKey), JSON.stringify(templates), {
				EX: 60 * 60 * 24
			})
			res
				.json({ message: "OK", result: templates, success: true })
				.end();
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

			await pushSubscriptionService.handleSubscription({
				project_id: projectId,
				...req.body
			})

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
			const body = req.body
			await pushSubscriptionService.deleteSubscription(body.endpoint, body.projectId);
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
	}
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

		req.on("close", () => {
			clients.get(projectId)?.delete(res);
		});
	};
	triggerNotification = async (req: Request<{}, {}, NotificationBody, {}>, res: Response) => {
		try {

			const parsed = notificationSchema.safeParse(req.body);

			if (!parsed.success) {
				res.status(400).json({
					message: "Bad Request. Invalid Payload",
					result: parsed.error.format(),
					success: false
				}).end();

				return
			}
			const { projectId, ...rest } = req.body;
			if (projectId && rest.type === "-1" && rest?.data) {
				const value = await Cache.cache.get(`${projectId}-notification`)
				if (!value) {
					await sendPushQueue.add("send-browser-notification1", JSON.stringify(req.body));
				} else {
					const t = JSON.parse(value) as { subcription: { endpoint: string, keys: { p256dh: string, auth: string } }[], vapidKeys: { publicKey: string, privateKey: string } }
					webpush.setVapidDetails('mailto:6yqyD@example.com', t.vapidKeys.publicKey, t.vapidKeys.privateKey);
					t.subcription.forEach((sub) => {
						webpush.sendNotification(sub, JSON.stringify(rest.data));
					})
				}

				res.setHeader("Content-Security-Policy", "img-src * data: 'self';");
				res.setHeader("X-Content-Type-Options", "nosniff");
				res.setHeader("X-Notification-Type", "push");
				res.json({
					message: "OK",
					result: "Notification Sent",
					success: true
				}).end();
				return
			}
			res.setHeader("X-Notification-Type", "custom");

			const payload = JSON.stringify(rest);

			clients.get(projectId)?.forEach((client) => {
				client.write(`data: ${payload}\n\n`);
			});

			res.json({
				message: "OK",
				result: "Notification Sent",
				success: true
			}).end();
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
	}

	sound = async (req: Request, res: Response) => {
		const ext = req.query?.ext as string;
		const filePath = path.join(process.cwd(), "public", "pinglet-sound.mp3");
		if (ext === "mp3") {
			res.setHeader("Content-Type", "audio/mp3");
			res.setHeader("Content-Disposition", "inline; filename=pinglet-sound.mp3");
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
		const dynamicCode = `self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  const options = {
    body: data?.body,
    icon: data?.icon,
    badge: data?.badge,
    tag: data?.tag,
    requireInteraction: data?.requireInteraction||true,
    silent: data?.silent||false,
    data: data?.data,
    actions: data?.actions,
    image: data?.image,  
    timestamp: Date.now(),
    vibrate: [200, 100, 200], // Vibration pattern for mobile
  };

  // Auto-dismiss after duration
  if (data.data && data.data.duration) {
    setTimeout(() => {
      self.registration
        .getNotifications({ tag: data.tag })
        .then((notifications) => {
          notifications.forEach((notification) => notification.close());
        });
    }, data.data.duration);
  }

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    // Open the app/website
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  } else if (event.action === "dismiss") {
    // Just close the notification
    return;
  } else {
    // Default click action
    event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
  }
});

// Handle notification close
self.addEventListener("notificationclose", (event) => {
  console.log("Notification closed:", event.notification.tag);
});`;
		res.set("Content-Type", "application/javascript");
		res.send(dynamicCode);
	};
	loadWidgetJsFile = async (req: Request, res: Response) => {
		const wid = req.params.wid
		res.set("Content-Type", "application/javascript");
		if (!wid) {
			res.send(WidgetErrorTemplate("Widget ID is required"));
			return
		}
		const cachedValue = await Cache.cache.get(wid)
		if (!cachedValue) {
			const widget = await WidgetService.getWidgetByWidgetId(wid);
			if (!widget) {
				res.send(WidgetErrorTemplate("Invalid Widget ID"));
				return
			}
			Cache.cache.set(wid, JSON.stringify({
				data: widget.data,
				style_props: widget.style_props
			}), { EX: 60 * 60 * 24 });
			return
		}

		const widget = JSON.parse(cachedValue)
		res.set("Content-Type", "application/javascript");
		res.send(DEFAULT_WIDGET_TEMPLATE(req.params.wid,
			widget.data.text,
			widget.data.description,
			widget.data.buttonText,
			widget.data.link,
			widget.data.imagePreview));
	};




}

export default new PushNtfyController();
