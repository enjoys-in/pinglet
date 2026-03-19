import type { PlanLimits } from "@/factory/entities/plan.entity";
import { planService } from "@/handlers/services/plan.service";
import type { NextFunction, Request, Response } from "express";

type QuotaType = "widget" | "webhook" | "notification" | "project" | "template";
type FeatureKey = keyof PlanLimits["features"];

/**
 * Middleware factory that checks if the user's plan allows creating more of a resource.
 */
export function checkPlanQuota(resource: QuotaType) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", result: null, success: false });
				return;
			}

			let check: { allowed: boolean; current: number; max: number };

			switch (resource) {
				case "widget":
					check = await planService.canCreateWidget(userId);
					break;
				case "webhook":
					check = await planService.canCreateWebhook(userId);
					break;
				case "notification":
					check = await planService.canSendNotification(userId);
					break;
				case "project":
					check = await planService.canCreateProject(userId);
					break;
				case "template":
					check = await planService.canCreateTemplate(userId);
					break;
				default:
					return next();
			}

			if (!check.allowed) {
				res.status(403).json({
					message: `Plan limit reached for ${resource}s. Current: ${check.current}, Max: ${check.max}. Please upgrade your plan.`,
					result: { current: check.current, max: check.max },
					success: false,
				});
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}

/**
 * Middleware factory that checks if the user's plan includes a specific feature.
 */
export function requireFeature(feature: FeatureKey) {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.user?.id;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", result: null, success: false });
				return;
			}

			const hasAccess = await planService.hasFeature(userId, feature);
			if (!hasAccess) {
				res.status(403).json({
					message: `Your plan does not include the "${feature}" feature. Please upgrade your plan.`,
					result: null,
					success: false,
				});
				return;
			}

			next();
		} catch (error) {
			next(error);
		}
	};
}
