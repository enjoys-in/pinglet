import { NotificationEntity } from "@/factory/entities/notifications.entity";
import {
	PLAN_LIMITS,
	type PlanLimits,
	PlanType,
} from "@/factory/entities/plan.entity";
import { TemplatesEntity } from "@/factory/entities/templates.entity";
import { UserEntity } from "@/factory/entities/users.entity";
import { WebhookEntity } from "@/factory/entities/webhook.entity";
import { WidgetEntity } from "@/factory/entities/widget.entity";
import { InjectRepository } from "@/factory/typeorm";
import { Cache } from "@/utils/services/redis/cacheService";
import type { Repository } from "typeorm";

class PlanService {
	constructor(
		private readonly userRepo: Repository<UserEntity>,
		private readonly widgetRepo: Repository<WidgetEntity>,
		private readonly webhookRepo: Repository<WebhookEntity>,
		private readonly notificationRepo: Repository<NotificationEntity>,
		private readonly templateRepo: Repository<TemplatesEntity>,
	) {}

	/**
	 * Get plan limits for a user by their plan_type column.
	 */
	getLimitsForPlan(planType: PlanType): PlanLimits {
		return PLAN_LIMITS[planType] ?? PLAN_LIMITS[PlanType.FREE];
	}

	/**
	 * Get the user's current plan type. Falls back to FREE.
	 */
	async getUserPlanType(userId: number): Promise<PlanType> {
		const user = await this.userRepo.findOne({
			where: { id: userId },
			select: { id: true, plan_type: true, plan_expires_at: true },
		});
		if (!user) return PlanType.FREE;

		// If plan has expired, treat as FREE
		if (user.plan_expires_at && new Date(user.plan_expires_at) < new Date()) {
			return PlanType.FREE;
		}

		return user.plan_type ?? PlanType.FREE;
	}

	/**
	 * Get the full plan limits for a specific user.
	 */
	async getUserLimits(userId: number): Promise<PlanLimits> {
		const planType = await this.getUserPlanType(userId);
		return this.getLimitsForPlan(planType);
	}

	/**
	 * Check if the user can create another widget.
	 */
	async canCreateWidget(userId: number): Promise<{ allowed: boolean; current: number; max: number }> {
		const limits = await this.getUserLimits(userId);
		if (limits.max_widgets === -1) return { allowed: true, current: 0, max: -1 };

		const count = await this.widgetRepo.count({
			where: { user: { id: userId } },
		});
		return { allowed: count < limits.max_widgets, current: count, max: limits.max_widgets };
	}

	/**
	 * Check if the user can create another webhook.
	 */
	async canCreateWebhook(userId: number): Promise<{ allowed: boolean; current: number; max: number }> {
		const limits = await this.getUserLimits(userId);
		if (limits.max_webhooks === -1) return { allowed: true, current: 0, max: -1 };

		const count = await this.webhookRepo.count({
			where: { user_id: userId },
		});
		return { allowed: count < limits.max_webhooks, current: count, max: limits.max_webhooks };
	}

	/**
	 * Check if notifications can be sent for a project (monthly quota).
	 * Sums total_sent across all projects owned by the user this month.
	 */
	async canSendNotification(userId: number): Promise<{ allowed: boolean; current: number; max: number }> {
		const limits = await this.getUserLimits(userId);
		if (limits.max_notifications_per_month === -1) return { allowed: true, current: 0, max: -1 };

		const result = await this.notificationRepo
			.createQueryBuilder("n")
			.innerJoin("n.project", "project")
			.innerJoin("project.website", "website")
			.innerJoin("website.user", "ws_user")
			.where("ws_user.id = :userId", { userId })
			.select("COALESCE(SUM(n.total_sent), 0)", "total")
			.getRawOne();

		const current = Number.parseInt(result?.total ?? "0", 10);
		return {
			allowed: current < limits.max_notifications_per_month,
			current,
			max: limits.max_notifications_per_month,
		};
	}

	/**
	 * Single-shot check for send permissions: quota + feature flags.
	 * Fetches the plan type ONCE and caches the monthly count in Redis (60s TTL).
	 * Eliminates redundant DB round-trips for repeated hasFeature / canSendNotification calls.
	 */
	async checkSendPermissions(
		userId: number,
		features: (keyof PlanLimits["features"])[],
	): Promise<{
		quota: { allowed: boolean; current: number; max: number };
		features: Record<string, boolean>;
	}> {
		// 1 DB call for plan type
		const planType = await this.getUserPlanType(userId);
		const limits = this.getLimitsForPlan(planType);

		// Feature flags — purely in-memory lookup, zero DB calls
		const featureResults: Record<string, boolean> = {};
		for (const f of features) featureResults[f] = limits.features[f] ?? false;

		// Quota check with Redis cache
		if (limits.max_notifications_per_month === -1) {
			return { quota: { allowed: true, current: 0, max: -1 }, features: featureResults };
		}

		const month = new Date().toISOString().slice(0, 7);
		const cacheKey = `notif-quota:${userId}:${month}`;
		let current: number;

		try {
			const cached = await Cache.cache.get(cacheKey);
			if (cached !== null) {
				current = Number.parseInt(cached, 10);
			} else {
				const result = await this.notificationRepo
					.createQueryBuilder("n")
					.innerJoin("n.project", "project")
					.innerJoin("project.website", "website")
					.innerJoin("website.user", "ws_user")
					.where("ws_user.id = :userId", { userId })
					.select("COALESCE(SUM(n.total_sent), 0)", "total")
					.getRawOne();
				current = Number.parseInt(result?.total ?? "0", 10);
				await Cache.cache.set(cacheKey, String(current), { EX: 60 });
			}
		} catch {
			// Redis down — fall through to DB
			const result = await this.notificationRepo
				.createQueryBuilder("n")
				.innerJoin("n.project", "project")
				.innerJoin("project.website", "website")
				.innerJoin("website.user", "ws_user")
				.where("ws_user.id = :userId", { userId })
				.select("COALESCE(SUM(n.total_sent), 0)", "total")
				.getRawOne();
			current = Number.parseInt(result?.total ?? "0", 10);
		}

		return {
			quota: {
				allowed: current < limits.max_notifications_per_month,
				current,
				max: limits.max_notifications_per_month,
			},
			features: featureResults,
		};
	}

	/**
	 * Check if the user can create another project.
	 */
	async canCreateProject(userId: number): Promise<{ allowed: boolean; current: number; max: number }> {
		const limits = await this.getUserLimits(userId);
		if (limits.max_projects === -1) return { allowed: true, current: 0, max: -1 };

		const result = await this.notificationRepo
			.createQueryBuilder("n")
			.innerJoin("n.project", "project")
			.where("project.user_id = :userId", { userId })
			.select("COUNT(DISTINCT project.id)", "count")
			.getRawOne();

		const count = Number.parseInt(result?.count ?? "0", 10);
		return { allowed: count < limits.max_projects, current: count, max: limits.max_projects };
	}

	/**
	 * Check if the user can create another template.
	 */
	async canCreateTemplate(userId: number): Promise<{ allowed: boolean; current: number; max: number }> {
		const limits = await this.getUserLimits(userId);
		if (limits.max_templates === -1) return { allowed: true, current: 0, max: -1 };

		const count = await this.templateRepo.count({
			where: { user: { id: userId } },
		});
		return { allowed: count < limits.max_templates, current: count, max: limits.max_templates };
	}

	/**
	 * Check if a user has access to a specific feature.
	 */
	async hasFeature(userId: number, feature: keyof PlanLimits["features"]): Promise<boolean> {
		const limits = await this.getUserLimits(userId);
		return limits.features[feature] ?? false;
	}

	/**
	 * Get full plan summary for the user (for dashboard display).
	 */
	async getUserPlanSummary(userId: number) {
		const planType = await this.getUserPlanType(userId);
		const limits = this.getLimitsForPlan(planType);
		const [widgetCheck, webhookCheck, notifCheck, projectCheck] =
			await Promise.all([
				this.canCreateWidget(userId),
				this.canCreateWebhook(userId),
				this.canSendNotification(userId),
				this.canCreateProject(userId),
			]);

		return {
			plan: planType,
			limits,
			usage: {
				widgets: { current: widgetCheck.current, max: widgetCheck.max },
				webhooks: { current: webhookCheck.current, max: webhookCheck.max },
				notifications_this_month: { current: notifCheck.current, max: notifCheck.max },
				projects: { current: projectCheck.current, max: projectCheck.max },
			},
		};
	}
}

export const planService = new PlanService(
	InjectRepository(UserEntity),
	InjectRepository(WidgetEntity),
	InjectRepository(WebhookEntity),
	InjectRepository(NotificationEntity),
	InjectRepository(TemplatesEntity),
);
