import crypto from "node:crypto";
import { createReadStream, readFile } from "node:fs";
import path from "node:path";
import type { Request, Response } from "express";
import { projectService } from "../services/project.service";
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

class PushNtfyController {
	loadConfig = async (req: Request, res: Response) => {
		const project = await projectService.getProjectsByWebsite(
			req.params.domain,
		);
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
		const filePath = path.join(__dirname, "pinglet-sound.mp3");
		if (ext === "mp3") {
			res.setHeader("Content-Type", "audio/mpeg");
			createReadStream(filePath).pipe(res);
		} else {
			readFile(filePath, (err, data) => {
				if (err) return res.status(500).send("Error reading file");
				const base64 = data.toString("base64");
				res.send(`data:audio/mp3;base64,${base64}`);
			});
		}
	};
}

export default new PushNtfyController();
