import {
	WidgetController,
	ProjectController,
	TemplateController,
	UserAuthController,
	WebhookController,
	SubscriptionController,
	WebsiteController,
	TemplateCategoryController,
	NotificationController,
} from "@handlers/controllers/user";
import { Router } from "express";

const router: Router = Router();


// Project
router.get("/projects", ProjectController.default.getAllProjects);
router.post("/project", ProjectController.default.createNewProject);
router.delete("/project/:id", ProjectController.default.deleteProject);
router.get("/project/:id", ProjectController.default.getProject);
router.put("/project/:id", ProjectController.default.updateProject);

// // User
// router.use("/user", UserAuthController.default);
// Website
router.get("/website", WebsiteController.default.getWebsite);
router.get("/websites", WebsiteController.default.getWebsites);
router.post("/website", WebsiteController.default.createWebsite);
router.delete("/website/:id", WebsiteController.default.deleteWebsite);
router.put("/website/:id", WebsiteController.default.updateWebsite);

// Subscriptions
router.get("/get-subscriptions", SubscriptionController.default.getSubscriptionsOfUser);
router.get("/get-my-subscriptions", SubscriptionController.default.getSubscriptionsByProjectId);

// Widgets
router.get("/widgets", WidgetController.default.getWidgets);
router.get("/widget", WidgetController.default.getWidget);
router.post("/widget", WidgetController.default.createWidget);
router.put("/widget/:id", WidgetController.default.updateWidget);
router.delete("/widget/:id", WidgetController.default.deleteWidget);

// Notification
router.get("/my-notifications", NotificationController.default.getNotification);
router.get("/my-notification/:id", NotificationController.default.getAllNotifications);
router.get("/my-notifications/:project_id", NotificationController.default.getNotificationsByProjectId);
router.get("/my-notifications/logs", NotificationController.default.getRawNotificationsByProjectId);
router.get("/my-notification/logs/:id", NotificationController.default.getRawNotificationsByProjectId);


// Webhook
// router.use("/webhook", WebhookController.default);
// Template
// router.use("/template", TemplateController.default);
// Template Category
router.get("/template-categories", TemplateCategoryController.default.getTemplateCategories);
router.get("/template-categories/:id/templates", TemplateCategoryController.default.getTemplatesByCategory);



export default router;
