import { NotificationLogEntity } from "@/factory/entities/notifications-log.entity";
import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { ProjectEntity } from "@/factory/entities/project.entity";
import { PushSubscriptionEntity } from "@/factory/entities/pushSubscription.entity";
import { WebsiteEntity } from "@/factory/entities/website.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Repository } from "typeorm";

// ---- Subscriber enrichment helpers ----

function deriveBrowser(endpoint: string, ua: string | null): string {
	// Primary: endpoint URL is deterministic per browser push service
	if (endpoint) {
		if (endpoint.includes("fcm.googleapis.com") || endpoint.includes("firebase")) return "Chrome";
		if (endpoint.includes("push.services.mozilla.com")) return "Firefox";
		if (endpoint.includes("wns.windows.com") || endpoint.includes("notify.windows.com")) return "Edge";
		if (endpoint.includes("web.push.apple.com") || endpoint.includes("push.apple.com")) return "Safari";
	}
	// Fallback: parse User-Agent if stored in info
	if (ua) {
		const lower = ua.toLowerCase();
		if (lower.includes("edg/") || lower.includes("edge/")) return "Edge";
		if (lower.includes("opr/") || lower.includes("opera")) return "Opera";
		if (lower.includes("chrome")) return "Chrome";
		if (lower.includes("firefox")) return "Firefox";
		if (lower.includes("safari")) return "Safari";
	}
	return "Unknown";
}

function deriveDeviceType(ua: string | null): "Mobile" | "Desktop" | "Tablet" | "Unknown" {
	if (!ua) return "Unknown";
	const lower = ua.toLowerCase();
	// Tablet checks first (tablet UAs often contain "mobile" too)
	if (lower.includes("ipad") || (lower.includes("android") && !lower.includes("mobile"))) return "Tablet";
	if (lower.includes("mobile") || lower.includes("iphone") || lower.includes("android")) return "Mobile";
	return "Desktop";
}

function deriveCountry(ua: string | null): string {
	// Cannot derive country from User-Agent — return "—"
	// Future: capture from SDK via navigator.language / IP geolocation
	return "—";
}

type FilterType = "5min" | "1hour" | "daily" | "weekly" | "monthly";
type GrowthFilter = "weekly" | "monthly" | "3months" | "6months" | "yearly";

interface TimeConfig {
	start: Date;
	intervalSql: string;
	labelFormat: string;
	points: number;
}

function getTimeConfig(filter: FilterType): TimeConfig {
	const now = new Date();
	switch (filter) {
		case "5min":
			return {
				start: new Date(now.getTime() - 5 * 60 * 1000),
				intervalSql: "30 seconds",
				labelFormat: "HH24:MI",
				points: 10,
			};
		case "1hour":
			return {
				start: new Date(now.getTime() - 60 * 60 * 1000),
				intervalSql: "5 minutes",
				labelFormat: "HH24:MI",
				points: 12,
			};
		case "daily":
			return {
				start: new Date(now.getTime() - 24 * 60 * 60 * 1000),
				intervalSql: "1 hour",
				labelFormat: "HH12 AM",
				points: 24,
			};
		case "weekly":
			return {
				start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
				intervalSql: "1 day",
				labelFormat: "Dy",
				points: 7,
			};
		case "monthly":
			return {
				start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
				intervalSql: "1 day",
				labelFormat: "Mon DD",
				points: 30,
			};
	}
}

function getGrowthConfig(filter: GrowthFilter): {
	start: Date;
	intervalSql: string;
	labelFormat: string;
	points: number;
} {
	const now = new Date();
	switch (filter) {
		case "weekly":
			return {
				start: new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000),
				intervalSql: "1 week",
				labelFormat: '"Week" W',
				points: 12,
			};
		case "monthly":
			return {
				start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
				intervalSql: "1 month",
				labelFormat: "Mon YYYY",
				points: 12,
			};
		case "3months":
			return {
				start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
				intervalSql: "1 week",
				labelFormat: "Mon DD",
				points: 12,
			};
		case "6months":
			return {
				start: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
				intervalSql: "1 week",
				labelFormat: "Mon DD",
				points: 24,
			};
		case "yearly":
			return {
				start: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
				intervalSql: "1 month",
				labelFormat: "Mon YYYY",
				points: 12,
			};
	}
}

function formatChange(current: number, previous: number, isPercent = false): string {
	const diff = current - previous;
	const sign = diff >= 0 ? "+" : "";
	if (isPercent) {
		const pctChange =
			previous === 0
				? current > 0
					? "+100%"
					: "0%"
				: `${sign}${(((current - previous) / previous) * 100).toFixed(1)}%`;
		return pctChange;
	}
	return `${sign}${diff}`;
}

class DashboardService {
	constructor(
		private readonly notificationRepo: Repository<NotificationEntity>,
		private readonly notificationLogRepo: Repository<NotificationLogEntity>,
		private readonly projectRepo: Repository<ProjectEntity>,
		private readonly subscriptionRepo: Repository<PushSubscriptionEntity>,
		private readonly websiteRepo: Repository<WebsiteEntity>,
	) {}

	/**
	 * Dashboard stats cards — aggregated totals + month-over-month changes
	 */
	async getStats(userId: number) {
		const now = new Date();
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
		const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

		// Aggregated notification totals across all user projects
		const totals = await this.notificationRepo
			.createQueryBuilder("n")
			.innerJoin("projects", "p", "p.unique_id = n.project_id")
			.where("p.user_id = :userId", { userId })
			.select("COALESCE(SUM(n.total_request), 0)", "total_request")
			.addSelect("COALESCE(SUM(n.total_sent), 0)", "total_sent")
			.addSelect("COALESCE(SUM(n.total_clicked), 0)", "total_clicked")
			.addSelect("COALESCE(SUM(n.total_failed), 0)", "total_failed")
			.addSelect("COALESCE(SUM(n.total_closed), 0)", "total_closed")
			.addSelect("COALESCE(SUM(n.total_dropped), 0)", "total_dropped")
			.getRawOne();

		// This month's logs
		const thisMonthLogs = await this.getLogCounts(userId, thirtyDaysAgo, now);
		// Previous month's logs
		const prevMonthLogs = await this.getLogCounts(userId, sixtyDaysAgo, thirtyDaysAgo);

		const totalRequest = Number(totals?.total_request ?? 0);
		const totalSent = Number(totals?.total_sent ?? 0);
		const totalClicked = Number(totals?.total_clicked ?? 0);
		const totalFailed = Number(totals?.total_failed ?? 0);
		const totalClosed = Number(totals?.total_closed ?? 0);
		const totalDropped = Number(totals?.total_dropped ?? 0);

		const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 1000) / 10 : 0;
		const dropRate = totalSent > 0 ? Math.round((totalDropped / totalSent) * 1000) / 10 : 0;

		const prevClickRate =
			(prevMonthLogs.sent ?? 0) > 0
				? Math.round(((prevMonthLogs.clicked ?? 0) / prevMonthLogs.sent) * 1000) / 10
				: 0;
		const prevDropRate =
			(prevMonthLogs.sent ?? 0) > 0
				? Math.round(((prevMonthLogs.dropped ?? 0) / prevMonthLogs.sent) * 1000) / 10
				: 0;
		const curClickRate =
			(thisMonthLogs.sent ?? 0) > 0
				? Math.round(((thisMonthLogs.clicked ?? 0) / thisMonthLogs.sent) * 1000) / 10
				: 0;
		const curDropRate =
			(thisMonthLogs.sent ?? 0) > 0
				? Math.round(((thisMonthLogs.dropped ?? 0) / thisMonthLogs.sent) * 1000) / 10
				: 0;

		// Count projects, websites, subscribers
		const [totalWebsites, totalProjects, subscribedUsers] = await Promise.all([
			this.websiteRepo.count({ where: { user: { id: userId }, is_active: true } }),
			this.projectRepo.count({ where: { user: { id: userId }, is_active: true } }),
			this.subscriptionRepo
				.createQueryBuilder("s")
				.innerJoin("projects", "p", "p.unique_id = s.project_id")
				.where("p.user_id = :userId", { userId })
				.andWhere("s.deleted_at IS NULL")
				.getCount(),
		]);

		// Previous month counts for websites/projects/subscribers
		const [prevWebsites, prevProjects, prevSubscribers] = await Promise.all([
			this.websiteRepo
				.createQueryBuilder("w")
				.where("w.user_id = :userId", { userId: userId })
				.andWhere("w.is_active = true")
				.andWhere("w.created_at < :thirtyDaysAgo", { thirtyDaysAgo })
				.andWhere("w.deleted_at IS NULL")
				.getCount(),
			this.projectRepo
				.createQueryBuilder("p")
				.where("p.user_id = :userId", { userId })
				.andWhere("p.is_active = true")
				.andWhere("p.created_at < :thirtyDaysAgo", { thirtyDaysAgo })
				.andWhere("p.deleted_at IS NULL")
				.getCount(),
			this.subscriptionRepo
				.createQueryBuilder("s")
				.innerJoin("projects", "p", "p.unique_id = s.project_id")
				.where("p.user_id = :userId", { userId })
				.andWhere("s.deleted_at IS NULL")
				.andWhere("s.created_at < :thirtyDaysAgo", { thirtyDaysAgo })
				.getCount(),
		]);

		return {
			total_requests: totalRequest,
			total_requests_change: formatChange(thisMonthLogs.request ?? 0, prevMonthLogs.request ?? 0, true),
			notifications_sent: totalSent,
			notifications_sent_change: formatChange(thisMonthLogs.sent ?? 0, prevMonthLogs.sent ?? 0, true),
			click_rate: clickRate,
			click_rate_change: `${curClickRate >= prevClickRate ? "+" : ""}${(curClickRate - prevClickRate).toFixed(1)}%`,
			drop_rate: dropRate,
			drop_rate_change: `${curDropRate >= prevDropRate ? "+" : ""}${(curDropRate - prevDropRate).toFixed(1)}%`,
			closed: totalClosed,
			closed_change: formatChange(thisMonthLogs.closed ?? 0, prevMonthLogs.closed ?? 0, true),
			failed: totalFailed,
			failed_change: formatChange(thisMonthLogs.failed ?? 0, prevMonthLogs.failed ?? 0, true),
			total_websites: totalWebsites,
			total_websites_change: formatChange(totalWebsites, prevWebsites),
			total_projects: totalProjects,
			total_projects_change: formatChange(totalProjects, prevProjects),
			subscribed_users: subscribedUsers,
			subscribed_users_change: formatChange(subscribedUsers, prevSubscribers),
		};
	}

	/**
	 * Notifications chart — sent/failed per time bucket
	 */
	async getNotificationsChart(userId: number, period: FilterType = "weekly") {
		const cfg = getTimeConfig(period);
		return this.getTimeSeries(
			userId,
			cfg,
			`SUM(CASE WHEN log.event = 'notification.sent' THEN 1 ELSE 0 END) as sent,
			 SUM(CASE WHEN log.event = 'notification.failed' THEN 1 ELSE 0 END) as failed`,
			(row) => ({
				name: row.label,
				sent: Number(row.sent ?? 0),
				failed: Number(row.failed ?? 0),
			}),
		);
	}

	/**
	 * Rates chart — clickRate/dropRate per time bucket
	 */
	async getRatesChart(userId: number, period: FilterType = "weekly") {
		const cfg = getTimeConfig(period);
		return this.getTimeSeries(
			userId,
			cfg,
			`SUM(CASE WHEN log.event = 'notification.sent' THEN 1 ELSE 0 END) as sent,
			 SUM(CASE WHEN log.event = 'notification.clicked' THEN 1 ELSE 0 END) as clicked,
			 SUM(CASE WHEN log.event = 'notification.dropped' THEN 1 ELSE 0 END) as dropped`,
			(row) => {
				const sent = Number(row.sent ?? 0);
				return {
					name: row.label,
					clickRate: sent > 0 ? Math.round((Number(row.clicked ?? 0) / sent) * 1000) / 10 : 0,
					dropRate: sent > 0 ? Math.round((Number(row.dropped ?? 0) / sent) * 1000) / 10 : 0,
				};
			},
		);
	}

	/**
	 * Recent subscribers with enriched device/browser info
	 */
	async getRecentSubscribers(userId: number, limit = 10) {
		const subs = await this.subscriptionRepo
			.createQueryBuilder("s")
			.innerJoin("projects", "p", "p.unique_id = s.project_id")
			.leftJoin("notifications", "n", "n.project_id = s.project_id")
			.where("p.user_id = :userId", { userId })
			.andWhere("s.deleted_at IS NULL")
			.orderBy("s.created_at", "DESC")
			.limit(limit)
			.select([
				"s.id as id",
				"s.project_id as project_id",
				"s.info as info",
				"s.endpoint as endpoint",
				"s.created_at as \"createdOn\"",
				"s.updated_at as \"updatedOn\"",
				"COALESCE(n.total_sent, 0) as \"notificationsSent\"",
			])
			.getRawMany();

		return subs.map((s) => {
			const browser = deriveBrowser(s.endpoint, s.info);
			const deviceType = deriveDeviceType(s.info);
			const country = deriveCountry(s.info);

			return {
				id: `SUB${String(s.id).padStart(3, "0")}`,
				deviceType,
				country,
				browser,
				notificationsSent: Number(s.notificationsSent ?? 0),
				createdOn: new Date(s.createdOn).toISOString().split("T")[0],
				updatedOn: new Date(s.updatedOn).toISOString().split("T")[0],
				subscribedTime: new Date(s.createdOn).toLocaleTimeString("en-US", {
					hour: "2-digit",
					minute: "2-digit",
					hour12: false,
				}),
			};
		});
	}

	// ===================== Analytics =====================

	/**
	 * Delivery overview — sent/failed per time bucket with filter
	 */
	async getDeliveryOverview(userId: number, filter: FilterType = "daily") {
		const cfg = getTimeConfig(filter);
		return this.getTimeSeries(
			userId,
			cfg,
			`SUM(CASE WHEN log.event = 'notification.sent' THEN 1 ELSE 0 END) as sent,
			 SUM(CASE WHEN log.event = 'notification.failed' THEN 1 ELSE 0 END) as failed`,
			(row) => ({
				time: row.label,
				sent: Number(row.sent ?? 0),
				failed: Number(row.failed ?? 0),
			}),
		);
	}

	/**
	 * Engagement rates — clickRate/dropRate/closeRate per time bucket
	 */
	async getEngagementRates(userId: number, filter: FilterType = "daily") {
		const cfg = getTimeConfig(filter);
		return this.getTimeSeries(
			userId,
			cfg,
			`SUM(CASE WHEN log.event = 'notification.sent' THEN 1 ELSE 0 END) as sent,
			 SUM(CASE WHEN log.event = 'notification.clicked' THEN 1 ELSE 0 END) as clicked,
			 SUM(CASE WHEN log.event = 'notification.dropped' THEN 1 ELSE 0 END) as dropped,
			 SUM(CASE WHEN log.event = 'notification.closed' THEN 1 ELSE 0 END) as closed`,
			(row) => {
				const sent = Number(row.sent ?? 0);
				return {
					time: row.label,
					clickRate: sent > 0 ? Math.round((Number(row.clicked ?? 0) / sent) * 1000) / 10 : 0,
					dropRate: sent > 0 ? Math.round((Number(row.dropped ?? 0) / sent) * 1000) / 10 : 0,
					closeRate: sent > 0 ? Math.round((Number(row.closed ?? 0) / sent) * 1000) / 10 : 0,
				};
			},
		);
	}

	/**
	 * Notification types — count by type per time bucket
	 */
	async getNotificationTypes(userId: number, filter: FilterType = "daily") {
		const cfg = getTimeConfig(filter);
		return this.getTimeSeries(
			userId,
			cfg,
			`SUM(CASE WHEN log.type = '0' THEN 1 ELSE 0 END) as type0,
			 SUM(CASE WHEN log.type = '-1' THEN 1 ELSE 0 END) as "typeNeg1",
			 SUM(CASE WHEN log.type = '1' THEN 1 ELSE 0 END) as type1`,
			(row) => ({
				time: row.label,
				type0: Number(row.type0 ?? 0),
				typeNeg1: Number(row.typeNeg1 ?? 0),
				type1: Number(row.type1 ?? 0),
			}),
		);
	}

	/**
	 * Subscriber growth over time
	 */
	async getSubscriberGrowth(userId: number, filter: GrowthFilter = "monthly") {
		const cfg = getGrowthConfig(filter);

		const rows = await this.subscriptionRepo
			.createQueryBuilder("s")
			.innerJoin("projects", "p", "p.unique_id = s.project_id")
			.where("p.user_id = :userId", { userId })
			.andWhere("s.created_at >= :start", { start: cfg.start })
			.andWhere("s.deleted_at IS NULL")
			.select(`TO_CHAR(DATE_TRUNC('${cfg.intervalSql === "1 week" ? "week" : cfg.intervalSql === "1 month" ? "month" : "day"}', s.created_at), '${cfg.labelFormat}')`, "label")
			.addSelect("COUNT(*)", "subscribers")
			.groupBy("label")
			.orderBy("MIN(s.created_at)", "ASC")
			.limit(cfg.points)
			.getRawMany();

		return rows.map((r) => ({
			time: r.label?.trim(),
			subscribers: Number(r.subscribers ?? 0),
		}));
	}

	/**
	 * Requests overview — all metrics per time bucket
	 */
	async getRequestsOverview(userId: number, filter: FilterType = "daily") {
		const cfg = getTimeConfig(filter);
		return this.getTimeSeries(
			userId,
			cfg,
			`SUM(CASE WHEN log.event = 'notification.request' THEN 1 ELSE 0 END) as requests,
			 SUM(CASE WHEN log.event = 'notification.sent' THEN 1 ELSE 0 END) as sent,
			 SUM(CASE WHEN log.event = 'notification.failed' THEN 1 ELSE 0 END) as failed,
			 SUM(CASE WHEN log.event = 'notification.closed' THEN 1 ELSE 0 END) as closed,
			 SUM(CASE WHEN log.event = 'notification.dropped' THEN 1 ELSE 0 END) as dropped`,
			(row) => ({
				time: row.label,
				requests: Number(row.requests ?? 0),
				sent: Number(row.sent ?? 0),
				failed: Number(row.failed ?? 0),
				closed: Number(row.closed ?? 0),
				dropped: Number(row.dropped ?? 0),
			}),
		);
	}

	/**
	 * Project subscriber trends — per-project subscriber counts per time bucket
	 */
	async getProjectSubscriberTrends(userId: number, filter: FilterType = "daily") {
		const cfg = getTimeConfig(filter);

		// Get up to 4 projects
		const projects = await this.projectRepo.find({
			where: { user: { id: userId }, is_active: true },
			select: { id: true, unique_id: true, name: true },
			take: 4,
			order: { created_at: "ASC" },
		});

		if (projects.length === 0) {
			return { projects: [], data: [] };
		}

		const projectKeys = projects.map((p, i) => ({
			key: `project${i + 1}`,
			label: p.name,
			uniqueId: p.unique_id,
		}));

		const truncExpr = this.getTruncExpression(cfg);

		// Build a query that counts subscribers per project per time bucket
		const qb = this.subscriptionRepo
			.createQueryBuilder("s")
			.innerJoin("projects", "p", "p.unique_id = s.project_id")
			.where("p.user_id = :userId", { userId })
			.andWhere("s.created_at >= :start", { start: cfg.start })
			.andWhere("s.deleted_at IS NULL")
			.select(`TO_CHAR(${truncExpr}, '${cfg.labelFormat}')`, "label");

		for (const pk of projectKeys) {
			qb.addSelect(
				`SUM(CASE WHEN s.project_id = '${pk.uniqueId}' THEN 1 ELSE 0 END)`,
				pk.key,
			);
		}

		const rows = await qb
			.groupBy("label")
			.orderBy(`MIN(s.created_at)`, "ASC")
			.limit(cfg.points)
			.getRawMany();

		return {
			projects: projectKeys.map((pk) => ({ key: pk.key, label: pk.label })),
			data: rows.map((r) => {
				const point: Record<string, any> = { time: r.label?.trim() };
				for (const pk of projectKeys) {
					point[pk.key] = Number(r[pk.key] ?? 0);
				}
				return point;
			}),
		};
	}

	// ===================== Helpers =====================

	private async getLogCounts(userId: number, from: Date, to: Date) {
		const rows = await this.notificationLogRepo
			.createQueryBuilder("log")
			.innerJoin("projects", "p", "p.unique_id = log.project_id")
			.where("p.user_id = :userId", { userId })
			.andWhere("log.triggered_at >= :from", { from: from.getTime().toString() })
			.andWhere("log.triggered_at < :to", { to: to.getTime().toString() })
			.select("log.event", "event")
			.addSelect("COUNT(*)", "count")
			.groupBy("log.event")
			.getRawMany();

		const m: Record<string, number> = {};
		for (const r of rows) {
			const short = (r.event as string).replace("notification.", "");
			m[short] = Number(r.count);
		}
		return m;
	}

	private getTruncExpression(cfg: TimeConfig): string {
		// Map interval SQL to date_trunc precision
		if (cfg.intervalSql === "30 seconds") return "DATE_TRUNC('minute', s.created_at)";
		if (cfg.intervalSql === "5 minutes") return "DATE_TRUNC('hour', s.created_at) + INTERVAL '5 min' * FLOOR(EXTRACT(MINUTE FROM s.created_at) / 5)";
		if (cfg.intervalSql === "1 hour") return "DATE_TRUNC('hour', s.created_at)";
		if (cfg.intervalSql === "1 day") return "DATE_TRUNC('day', s.created_at)";
		return "DATE_TRUNC('day', s.created_at)";
	}

	private async getTimeSeries<T>(
		userId: number,
		cfg: TimeConfig,
		selectAggregates: string,
		mapper: (row: any) => T,
	): Promise<T[]> {
		// Convert triggered_at (stored as unix ms string) to timestamp for grouping
		const truncExpr = this.getLogTruncExpression(cfg);

		const rows = await this.notificationLogRepo
			.createQueryBuilder("log")
			.innerJoin("projects", "p", "p.unique_id = log.project_id")
			.where("p.user_id = :userId", { userId })
			.andWhere("log.triggered_at >= :start", { start: cfg.start.getTime().toString() })
			.select(`TO_CHAR(${truncExpr}, '${cfg.labelFormat}')`, "label")
			.addSelect(selectAggregates)
			.groupBy("label")
			.orderBy(`MIN(log.triggered_at)`, "ASC")
			.limit(cfg.points)
			.getRawMany();

		return rows.map(mapper);
	}

	private getLogTruncExpression(cfg: TimeConfig): string {
		// triggered_at is stored as unix ms string → convert to timestamp
		const tsExpr = "TO_TIMESTAMP(CAST(log.triggered_at AS BIGINT) / 1000)";
		if (cfg.intervalSql === "30 seconds") return `DATE_TRUNC('minute', ${tsExpr})`;
		if (cfg.intervalSql === "5 minutes") return `DATE_TRUNC('hour', ${tsExpr}) + INTERVAL '5 min' * FLOOR(EXTRACT(MINUTE FROM ${tsExpr}) / 5)`;
		if (cfg.intervalSql === "1 hour") return `DATE_TRUNC('hour', ${tsExpr})`;
		if (cfg.intervalSql === "1 day") return `DATE_TRUNC('day', ${tsExpr})`;
		return `DATE_TRUNC('day', ${tsExpr})`;
	}
}

export const dashboardService = new DashboardService(
	InjectRepository(NotificationEntity),
	InjectRepository(NotificationLogEntity),
	InjectRepository(ProjectEntity),
	InjectRepository(PushSubscriptionEntity),
	InjectRepository(WebsiteEntity),
);
