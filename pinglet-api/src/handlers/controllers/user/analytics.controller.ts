import { dashboardService } from "@/handlers/services/dashboard.service";
import { cached } from "@/utils/helpers/cache";
import { CacheTTL } from "@/utils/types/cache";
import type { Request, Response } from "express";

const VALID_FILTERS = ["5min", "1hour", "daily", "weekly", "monthly"];
const VALID_GROWTH_FILTERS = ["weekly", "monthly", "3months", "6months", "yearly"];

class AnalyticsController {
	getDeliveryOverview = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const filter = (req.query.filter as string) || "daily";
			if (!VALID_FILTERS.includes(filter)) {
				res.status(400).json({ message: "Invalid filter", result: null, success: false }).end();
				return;
			}
			const data = await cached(
				`user:${userId}:analytics:delivery:${filter}`,
				CacheTTL.SHORT,
				() => dashboardService.getDeliveryOverview(userId, filter as any),
			);
			res.json({ message: "Delivery Overview", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getEngagementRates = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const filter = (req.query.filter as string) || "daily";
			if (!VALID_FILTERS.includes(filter)) {
				res.status(400).json({ message: "Invalid filter", result: null, success: false }).end();
				return;
			}
			const data = await cached(
				`user:${userId}:analytics:engagement:${filter}`,
				CacheTTL.SHORT,
				() => dashboardService.getEngagementRates(userId, filter as any),
			);
			res.json({ message: "Engagement Rates", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getNotificationTypes = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const filter = (req.query.filter as string) || "daily";
			if (!VALID_FILTERS.includes(filter)) {
				res.status(400).json({ message: "Invalid filter", result: null, success: false }).end();
				return;
			}
			const data = await cached(
				`user:${userId}:analytics:types:${filter}`,
				CacheTTL.SHORT,
				() => dashboardService.getNotificationTypes(userId, filter as any),
			);
			res.json({ message: "Notification Types", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getSubscriberGrowth = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const filter = (req.query.filter as string) || "monthly";
			if (!VALID_GROWTH_FILTERS.includes(filter)) {
				res.status(400).json({ message: "Invalid filter", result: null, success: false }).end();
				return;
			}
			const data = await cached(
				`user:${userId}:analytics:growth:${filter}`,
				CacheTTL.SHORT,
				() => dashboardService.getSubscriberGrowth(userId, filter as any),
			);
			res.json({ message: "Subscriber Growth", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getRequestsOverview = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const filter = (req.query.filter as string) || "daily";
			if (!VALID_FILTERS.includes(filter)) {
				res.status(400).json({ message: "Invalid filter", result: null, success: false }).end();
				return;
			}
			const data = await cached(
				`user:${userId}:analytics:requests:${filter}`,
				CacheTTL.SHORT,
				() => dashboardService.getRequestsOverview(userId, filter as any),
			);
			res.json({ message: "Requests Overview", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getProjectSubscriberTrends = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const filter = (req.query.filter as string) || "daily";
			if (!VALID_FILTERS.includes(filter)) {
				res.status(400).json({ message: "Invalid filter", result: null, success: false }).end();
				return;
			}
			const data = await cached(
				`user:${userId}:analytics:project-trends:${filter}`,
				CacheTTL.SHORT,
				() => dashboardService.getProjectSubscriberTrends(userId, filter as any),
			);
			res.json({ message: "Project Subscriber Trends", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};
}

export default new AnalyticsController();
