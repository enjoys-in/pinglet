import { createReadStream, readFile } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { projectService } from "../services/project.service";

import { Cache } from "@/utils/services/redis/cacheService";
import { NotificationBody, notificationSchema } from "@/utils/validators/notfication-send";
import webpush from "web-push";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";
const clients = new Map<string, Set<Response>>();

const vapidKeys = {
	publicKey: "BJ9GvEJAs47DOgqw-rN80ZGIVvIvcp-xE4ZNweCT4eJ0B-rIzMtfhLWh8ySUCeKgiW_Fym69h0Fx3vhAcAy6C2k",
	privateKey: "STXRbh1ldyhUQYth0MBMBTeJXGFndcuRapVsfuAF-ro",
};

webpush.setVapidDetails(
	"mailto:mullayam06@outlook.com",
	vapidKeys.publicKey,
	vapidKeys.privateKey
);

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

			await pushSubscriptionService.addNewSubscription({
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
					result: parsed.error.flatten(),
					success: false
				}).end();

				return
			}
			const { projectId, ...rest } = req.body;
			if (projectId && rest.type === "-1" && rest.body) {
				// Sends to queue
				// const payloadd = JSON.stringify({
				// 	title: "🔥 Pinglet WebPush",
				// 	body: "This is a push sent from the server!",
				// 	icon: "https://cdn-icons-png.flaticon.com/512/727/727399.png",
				// });
				// const sub = subscriptions.get(req.body.projectId)
				// res.setHeader("Content-Security-Policy", "img-src * data: 'self';");
				// if (sub) {
				// 	webpush.sendNotification(sub, payloadd)
				// }
				res.json({
					message: "OK",
					result: "Notification Sent",
					success: true
				}).end();
				return
			}

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
			res.setHeader("Content-Type", "audio/mpeg");
			createReadStream(filePath).pipe(res);
		} else {
			// res.setHeader("Content-Type", "audio/mp3");
			// res.setHeader("Content-Disposition", "inline; filename=pinglet-sound.mp3");
			// res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year cache
			// res.setHeader("Content-Length", "123456");
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
		const dynamicCode = `self.addEventListener("push", event => {
      const data = event.data.json();
      event.waitUntil(
        self.registration.showNotification(data.title, {
          body: data.body,
          icon: data.icon
        })
      );
    });
  `;
		res.set("Content-Type", "application/javascript");
		res.send(dynamicCode);
	};




}

export default new PushNtfyController();
