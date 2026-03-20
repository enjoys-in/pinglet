import {
	ActivityController,
	AnalyticsController,
	DashboardController,
	FlowController,
	InboxController,
	NotificationController,
	PlanController,
	PresenceController,
	ProjectController,
	SubscriptionController,
	TemplateCategoryController,
	TemplateController,
	UnsubscribeAnalyticsController,
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

// Dashboard
router.get("/dashboard/stats", DashboardController.default.getStats);
router.get("/dashboard/notifications-chart", DashboardController.default.getNotificationsChart);
router.get("/dashboard/rates-chart", DashboardController.default.getRatesChart);
router.get("/dashboard/subscribers", DashboardController.default.getSubscribers);

// Analytics
router.get("/analytics/delivery-overview", AnalyticsController.default.getDeliveryOverview);
router.get("/analytics/engagement-rates", AnalyticsController.default.getEngagementRates);
router.get("/analytics/notification-types", AnalyticsController.default.getNotificationTypes);
router.get("/analytics/subscriber-growth", AnalyticsController.default.getSubscriberGrowth);
router.get("/analytics/requests-overview", AnalyticsController.default.getRequestsOverview);
router.get("/analytics/project-subscriber-trends", AnalyticsController.default.getProjectSubscriberTrends);

// Activity & Session Replay
router.get("/activity/stats", ActivityController.default.getActivityStats);
router.get("/activity/events", ActivityController.default.getActivityEvents);
router.get("/activity/visitor", ActivityController.default.getVisitorActivity);
router.get("/sessions", ActivityController.default.getSessionRecordings);
router.get("/sessions/:id", ActivityController.default.getSessionRecording);
router.delete("/sessions/:id", ActivityController.default.deleteSessionRecording);

// Notification Inbox
router.get("/inbox", InboxController.default.getInbox);
router.put("/inbox/:id/read", InboxController.default.markAsRead);
router.put("/inbox/read-all", InboxController.default.markAllAsRead);
router.delete("/inbox/:id", InboxController.default.deleteFromInbox);

// Unsubscribe Analytics
router.get("/unsubscribe-analytics", UnsubscribeAnalyticsController.default.getReasonBreakdown);
router.get("/unsubscribe-analytics/trend", UnsubscribeAnalyticsController.default.getUnsubscribeTrend);
router.get("/unsubscribe-analytics/logs", UnsubscribeAnalyticsController.default.getLogs);
router.get("/unsubscribe-analytics/summary", UnsubscribeAnalyticsController.default.getSummary);

// Live Presence
router.get("/presence/online", PresenceController.default.getOnlineCount);
router.get("/presence/all", PresenceController.default.getAllOnlineCounts);

// Flows
router.get("/flows", FlowController.default.getAllFlows);
router.get("/flows/stats", FlowController.default.getStats);
router.get("/flows/:id", FlowController.default.getFlow);
router.post("/flows", FlowController.default.createFlow);
router.put("/flows/:id", FlowController.default.updateFlow);
router.delete("/flows/:id", FlowController.default.deleteFlow);
router.patch("/flows/:id/status", FlowController.default.updateStatus);
router.get("/flows/:id/logs", FlowController.default.getExecutions);

export default router;
