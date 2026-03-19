import {
	PLAN_LIMITS,
	PlanType,
} from "@/factory/entities/plan.entity";
import { planService } from "@/handlers/services/plan.service";
import { userService } from "@/handlers/services/users.service";
import { cached, invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation, CacheKeys, CacheTTL } from "@/utils/types/cache";
import type { Request, Response } from "express";

class PlanController {
	/**
	 * Get all available plans with their limits and pricing.
	 */
	async getPlans(_req: Request, res: Response) {
		try {
			const plans = await cached(CacheKeys.plans(), CacheTTL.STATIC, async () => [
				{
					name: PlanType.FREE,
					display_name: "Free",
					price_monthly: 0,
					price_annual: 0,
					limits: PLAN_LIMITS[PlanType.FREE],
					features_list: [
						"Up to 10K notifications/month",
						"Basic analytics dashboard",
						"Standard delivery speed",
						"Email support",
						"Basic targeting options",
					],
				},
				{
					name: PlanType.STARTER,
					display_name: "Starter",
					description: "Perfect for small teams and startups.",
					price_monthly: 7,
					price_annual: Math.round(7 * 12 * 0.8),
					limits: PLAN_LIMITS[PlanType.STARTER],
					features_list: [
						"Up to 50-100K notifications/month",
						"Basic analytics dashboard",
						"Standard delivery speed",
						"Email support",
						"Basic targeting options",
						"100 Widgets",
						"Limited integrations",
					],
				},
				{
					name: PlanType.PROFESSIONAL,
					display_name: "Professional",
					description: "Ideal for growing businesses.",
					price_monthly: 29,
					price_annual: Math.round(29 * 12 * 0.8),
					most_popular: true,
					limits: PLAN_LIMITS[PlanType.PROFESSIONAL],
					features_list: [
						"Up to 500K notifications/month",
						"Advanced analytics & A/B testing",
						"Up to 250 Custom Widgets",
						"Limited Custom HTML Editor",
						"Browser notifications",
						"Priority email support",
						"Limited Webhooks",
					],
				},
				{
					name: PlanType.ENTERPRISE,
					display_name: "Enterprise",
					description: "For large organizations with complex needs.",
					price_monthly: 99,
					price_annual: Math.round(99 * 12 * 0.8),
					limits: PLAN_LIMITS[PlanType.ENTERPRISE],
					features_list: [
						"Unlimited notifications",
						"Custom analytics",
						"AI-powered optimization",
						"24/7 phone & email support",
						"Advanced API access",
						"Unlimited Custom Widgets",
						"White-label solution",
						"Webhook integration",
						"Custom HTML templates",
					],
				},
			]);

			res.json({ message: "Available plans", result: plans, success: true });
		} catch (error) {
			res.status(500).json({ message: "Something went wrong", result: null, success: false });
		}
	}

	/**
	 * Get the current user's plan summary (plan, usage, limits).
	 */
	async getMyPlan(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", result: null, success: false });
				return;
			}
			const summary = await cached(
				CacheKeys.userPlanSummary(userId),
				CacheTTL.SHORT,
				() => planService.getUserPlanSummary(userId),
			);
			res.json({ message: "Current plan", result: summary, success: true });
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false });
				return;
			}
			res.status(500).json({ message: "Something went wrong", result: null, success: false });
		}
	}

	/**
	 * Upgrade / change user plan.
	 * Only downgrade to FREE is allowed without payment.
	 * Paid upgrades require a valid payment_token (to be verified with payment provider).
	 */
	async changePlan(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", result: null, success: false });
				return;
			}

			const { plan_type, billing_cycle, payment_token } = req.body as {
				plan_type: PlanType;
				billing_cycle?: "monthly" | "annual";
				payment_token?: string;
			};

			if (!plan_type || !Object.values(PlanType).includes(plan_type)) {
				res.status(400).json({ message: "Invalid plan type", result: null, success: false });
				return;
			}

			// Only allow direct downgrade to FREE without payment
			if (plan_type !== PlanType.FREE) {
				if (!payment_token) {
					res.status(402).json({
						message: "Payment required to upgrade plan. Please provide a valid payment_token.",
						result: null,
						success: false,
					});
					return;
				}
				// TODO: Verify payment_token with payment provider (e.g., Stripe)
				// const paymentValid = await paymentService.verifyPayment(payment_token, plan_type, billing_cycle);
				// if (!paymentValid) {
				//   res.status(402).json({ message: "Payment verification failed", result: null, success: false });
				//   return;
				// }
			}

			const cycle = billing_cycle === "annual" ? "annual" : "monthly";
			const expiresAt = plan_type === PlanType.FREE ? null : new Date();
			if (expiresAt) {
				if (cycle === "annual") {
					expiresAt.setFullYear(expiresAt.getFullYear() + 1);
				} else {
					expiresAt.setMonth(expiresAt.getMonth() + 1);
				}
			}

			await userService.updateUser(userId, {
				plan_type,
				billing_cycle: cycle,
				plan_expires_at: expiresAt,
			});

			await invalidateCache(CacheInvalidation.plan(userId));
			const summary = await planService.getUserPlanSummary(userId);
			res.json({ message: "Plan updated successfully", result: summary, success: true });
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false });
				return;
			}
			res.status(500).json({ message: "Something went wrong", result: null, success: false });
		}
	}

	/**
	 * Check a specific feature entitlement for the current user.
	 */
	async checkFeature(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", result: null, success: false });
				return;
			}

			const feature = req.params.feature as keyof (typeof PLAN_LIMITS)[PlanType.FREE]["features"];
			const hasAccess = await cached(
				CacheKeys.userFeature(userId, feature),
				CacheTTL.SHORT,
				() => planService.hasFeature(userId, feature),
			);

			res.json({
				message: hasAccess ? "Feature available" : "Feature not available on your plan",
				result: { feature, available: hasAccess },
				success: hasAccess,
			});
		} catch (error) {
			res.status(500).json({ message: "Something went wrong", result: null, success: false });
		}
	}
}

export default new PlanController();
