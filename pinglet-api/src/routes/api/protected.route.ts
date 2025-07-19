
import pushNtfyController from "@/handlers/controllers/push-ntfy.controller";

import {
	NotificationController,
	ProjectController,
	UserAuthController,
	WebhookController,
	WebsiteController,
	TemplateCategoryController,
	TemplateController
} from "@handlers/controllers/user";
import { Router } from "express";
import { WebSocketServer } from "ws";
const router: Router = Router();

// Notification
// router.use("/notification", NotificationController.default);
// Project
router.get("/projects", ProjectController.default.getAllProjects);
router.post("/project", ProjectController.default.createNewProject);
router.delete("/project/:id", ProjectController.default.deleteProject);
router.get("/project/:id", ProjectController.default.getProject);

// // User
// router.use("/user", UserAuthController.default);
// Website
router.get("/website", WebsiteController.default.getWebsite);
router.get("/websites", WebsiteController.default.getWebsites);
router.post("/website", WebsiteController.default.createWebsite);
router.delete("/website/:id", WebsiteController.default.deleteWebsite);
router.put("/website/:id", WebsiteController.default.updateWebsite);
// // Webhook
// router.use("/webhook", WebhookController.default);
// // Template
// router.use("/template", TemplateController.default);
// // Template Category
router.get("/template-categories", TemplateCategoryController.default.getTemplateCategories);
router.get("/template-categories/:id/templates", TemplateCategoryController.default.getTemplatesByCategory);

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
