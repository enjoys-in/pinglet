import crypto from "node:crypto";
import { createReadStream, readFile } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { projectService } from "../services/project.service";

import { In } from "typeorm";
const clients = new Map<string, Set<Response>>();

const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
let encrypted = cipher.update("Secret message", "utf8", "base64");
encrypted += cipher.final("base64");
const tag = cipher.getAuthTag().toString("base64");

const payload = {
	iv: iv.toString("base64"),
	encrypted,
	tag,
};

let base64Mp3: string | null = null;
class PushNtfyController {
	loadConfig = async (req: Request, res: Response) => {
		try {
			const query = req.query as { projectIds: string, domain: string };

			if (!query.projectIds || !query.domain) {
				throw new Error("Missing projectIds or domain");
			}
			const projectIds = query.projectIds.split(",");
			const configuredDomain = query.domain;
			const project = await projectService.getProjectsByWebsite(configuredDomain);
			if (!project) {
				throw new Error("Project not found for the given domain");
			}
			if (!(projectIds.some(p => project?.unique_id === p))) {
				throw new Error("Project ID does not match the configured domain");
			}
			const loadConfig = await projectService.getSelectedProjects({
				where: { unique_id: In(projectIds), is_active: true },
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
			}
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
	subscribeNotificatons = async (req: Request, res: Response) => {
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
	pushNotificatons = async (req: Request, res: Response) => {
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
	triggerNotification = async (req: Request, res: Response) => {
		const { projectId, ...rest } = req.body;
		const payload = JSON.stringify(rest);

		// SSE clients
		clients.get(projectId)?.forEach((client) => {
			client.write(`data: ${payload}\n\n`);
		});

		// // WS clients
		// sockets.get(projectId)?.forEach(socket => {
		//     if (socket.readyState === 1) socket.send(payload);
		// });

		res.send({ status: "sent" });
	};
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
}

export default new PushNtfyController();
