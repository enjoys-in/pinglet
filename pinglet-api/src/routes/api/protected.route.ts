import pushNtfyController from "@/handlers/controllers/push-ntfy.controller";
import {
	NotificationController,
	ProjectController,
	UserAuthController,
	WebhookController,
	WebsiteController,
} from "@handlers/controllers/user";
import { Router } from "express";
import { WebSocketServer } from "ws";
const router: Router = Router();

// Notification
// router.use("/notification", NotificationController.default);
// // Project
// router.use("/project", ProjectController.default);
// // User
// router.use("/user", UserAuthController.default);
// // Website
// router.use("/website", WebsiteController.default);
// // Webhook
// router.use("/webhook", WebhookController.default);

const sockets = new Map<string, Set<WebSocket>>();

// SSE endpoint
router.get("/notifications/sse", pushNtfyController.pushNotificatons);
// API to trigger a notification
router.post("/notifications/send", pushNtfyController.triggerNotification);
router.get("/notification-sound", pushNtfyController.sound);

// const server = http.createServer( );
// const wss = new WebSocketServer({ port: 7146, path: '/notifications/ws' });
// wss.on('connection', (ws, req) => {
//     // const url = new URL(req.url, `http://${req.headers.host}`);
//     // const projectId = url.searchParams.get('projectId');

//     // if (!projectId) return ws.close();

//     // if (!sockets.has(projectId)) sockets.set(projectId, new Set());
//     // sockets.get(projectId).add(ws);

//     // ws.on('close', () => {
//     //     sockets.get(projectId)?.delete(ws);
//     // });
// });

export default router;
