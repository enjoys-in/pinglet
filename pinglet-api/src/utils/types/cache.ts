/**
 * Centralized cache key patterns and TTL constants.
 * All cache keys MUST be constructed using these helpers to avoid collisions.
 */

// --- TTL Constants (seconds) ---

export const CacheTTL = {
	/** Static / rarely-changing data (plans catalog, template categories) */
	STATIC: 60 * 60 * 24, // 24h
	/** Slow-changing per-user resources (websites, widgets, webhooks) */
	LONG: 60 * 5, // 5 min
	/** Moderate-changing resources (templates, projects) */
	MEDIUM: 60 * 2, // 2 min
	/** Fast-changing resources (plan usage, notifications summaries) */
	SHORT: 60, // 60s
	/** High-churn data (subscriptions, raw logs) */
	BRIEF: 30, // 30s
	/** Widget/config served to SDK clients */
	SDK: 60 * 60 * 24, // 24h
} as const;

export type CacheTTLKey = keyof typeof CacheTTL;

// --- Cache key builders (type-safe, no magic strings) ---

export const CacheKeys = {
	// ---- Global (no user scope) ----
	plans: () => "plans:all",
	templateCategories: () => "template-categories:all",
	templates: () => "templates:all",

	// ---- Per-user ----
	userProjects: (userId: number) => `user:${userId}:projects`,
	userWebsites: (userId: number) => `user:${userId}:websites`,
	userWidgets: (userId: number) => `user:${userId}:widgets`,
	userWebhooks: (userId: number) => `user:${userId}:webhooks`,
	userPlanSummary: (userId: number) => `user:${userId}:plan-summary`,
	userFeature: (userId: number, feature: string) => `user:${userId}:feature:${feature}`,
	userNotifications: (userId: number) => `user:${userId}:notifications`,
	userSubscriptions: (userId: number) => `user:${userId}:subscriptions`,
	userFlows: (userId: number) => `user:${userId}:flows`,
	userFlowStats: (userId: number) => `user:${userId}:flow-stats`,

	// ---- Per-resource ----
	project: (projectId: number) => `project:${projectId}`,
	website: (websiteId: number) => `website:${websiteId}`,
	widget: (widgetId: number) => `widget:${widgetId}`,
	webhook: (webhookId: number) => `webhook:${webhookId}`,
	template: (templateId: number) => `template:${templateId}`,
	notification: (notificationId: number) => `notification:${notificationId}`,
	flow: (flowId: string) => `flow:${flowId}`,

	// ---- Per-user + resource compound ----
	userProjectNotifications: (userId: number, projectId: number | string) =>
		`user:${userId}:project:${projectId}:notifications`,
	userProjectSubscriptions: (userId: number, projectId: string) =>
		`user:${userId}:project:${projectId}:subscriptions`,
	userCategoryTemplates: (userId: number, categoryId: number) =>
		`user:${userId}:category:${categoryId}:templates`,

	// ---- SDK / public endpoints ----
	sdkConfig: (projectId: string, domain: string) => `${projectId}-${domain}`,
	sdkTemplates: (projectId: string, templateIds: string) =>
		Buffer.from(`${projectId}-${templateIds}`).toString("base64"),
	sdkWidget: (wid: string) => wid,

	// ---- Hot-path (triggerNotification) ----
	ntfyProject: (projectId: string) => `ntfy:project:${projectId}`,
	projectActiveFlows: (projectId: string) => `project:${projectId}:active-flows`,
} as const;

// --- Invalidation groups (for busting related caches on writes) ---

export const CacheInvalidation = {
	/** Call after project create/update/delete */
	project: (userId: number, projectId?: number) => {
		const keys = [CacheKeys.userProjects(userId)];
		if (projectId) keys.push(CacheKeys.project(projectId));
		return keys;
	},
	/** Call after website create/update/delete */
	website: (userId: number, websiteId?: number) => {
		const keys = [CacheKeys.userWebsites(userId)];
		if (websiteId) keys.push(CacheKeys.website(websiteId));
		return keys;
	},
	/** Call after widget create/update/delete */
	widget: (userId: number, widgetId?: number) => {
		const keys = [CacheKeys.userWidgets(userId)];
		if (widgetId) keys.push(CacheKeys.widget(widgetId));
		return keys;
	},
	/** Call after webhook create/update/delete */
	webhook: (userId: number, webhookId?: number) => {
		const keys = [CacheKeys.userWebhooks(userId)];
		if (webhookId) keys.push(CacheKeys.webhook(webhookId));
		return keys;
	},
	/** Call after template create/update/delete */
	template: (userId: number, templateId?: number) => {
		const keys: string[] = [CacheKeys.templates()];
		if (templateId) keys.push(CacheKeys.template(templateId));
		return keys;
	},
	/** Call after plan change */
	plan: (userId: number) => [
		CacheKeys.userPlanSummary(userId),
	],
	/** Call after flow create/update/delete */
	flow: (userId: number, flowId?: string) => {
		const keys = [CacheKeys.userFlows(userId), CacheKeys.userFlowStats(userId)];
		if (flowId) keys.push(CacheKeys.flow(flowId));
		return keys;
	},
	/** Call on any mutation that could affect hot-path notification cache for a project */
	ntfyProject: (projectId: string) => [
		CacheKeys.ntfyProject(projectId),
		CacheKeys.projectActiveFlows(projectId),
	],
} as const;
