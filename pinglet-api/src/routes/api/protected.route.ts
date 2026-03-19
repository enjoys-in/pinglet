import {
	NotificationController,
	PlanController,
	ProjectController,
	SubscriptionController,
	TemplateCategoryController,
	TemplateController,
	UserAuthController,
	WebhookController,
	WebsiteController,
	WidgetController,
} from "@handlers/controllers/user";
import { checkPlanQuota, requireFeature } from "@/middlewares/plan.middleware";
import { Router } from "express";

const router: Router = Router();

// Plan
router.get("/plans", PlanController.default.getPlans);
router.get("/my-plan", PlanController.default.getMyPlan);
router.post("/change-plan", PlanController.default.changePlan);
router.get("/plan/feature/:feature", PlanController.default.checkFeature);

// Project
router.get("/projects", ProjectController.default.getAllProjects);
router.post("/project", checkPlanQuota("project"), ProjectController.default.createNewProject);
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
router.get(
	"/get-subscriptions",
	SubscriptionController.default.getSubscriptionsOfUser,
);
router.get(
	"/get-my-subscriptions",
	SubscriptionController.default.getSubscriptionsByProjectId,
);

// Widgets
router.get("/widgets", WidgetController.default.getWidgets);
router.get("/widget/:id", WidgetController.default.getWidget);
router.post("/widget", checkPlanQuota("widget"), WidgetController.default.createWidget);
router.put("/widget/:id", WidgetController.default.updateWidget);
router.delete("/widget/:id", WidgetController.default.deleteWidget);

// Notification
router.get(
	"/notification-stats",
	NotificationController.default.getNotificationStats,
);
router.get(
	"/my-notifications",
	NotificationController.default.getAllNotifications,
);
router.get(
	"/my-notification/:id",
	NotificationController.default.getNotification,
);
router.get(
	"/my-notifications/:project_id",
	NotificationController.default.getNotificationsByProjectId,
);
router.get(
	"/my-notifications/logs",
	NotificationController.default.getRawNotificationsByProjectId,
);
router.get(
	"/my-notification/logs/:id",
	NotificationController.default.getRawNotificationsByProjectId,
);

// Webhook
router.get("/webhooks", WebhookController.default.getAllWebhooks);
router.get("/webhook/:id", WebhookController.default.getWebhook);
router.post("/webhook", checkPlanQuota("webhook"), WebhookController.default.createNewWebhook);
router.put("/webhook/:id", WebhookController.default.updateWebhook);
router.delete("/webhook/:id", WebhookController.default.deleteWebhook);
router.post("/webhook/:id/test", WebhookController.default.testWebhook);
// Template
router.get("/template", TemplateController.default.getTemplates);
router.get("/template/:id", TemplateController.default.getTemplateById);
router.post("/template", requireFeature("custom_html_editor"), checkPlanQuota("template"), TemplateController.default.createTemplate);
router.put("/template/:id", requireFeature("custom_html_editor"), TemplateController.default.updateTemplate);
router.delete("/template/:id", TemplateController.default.deleteTemplate);
// Template Category
router.get(
	"/template-categories",
	TemplateCategoryController.default.getTemplateCategories,
);
router.get(
	"/template-categories/:id/templates",
	TemplateCategoryController.default.getTemplatesByCategory,
);

export default router;
