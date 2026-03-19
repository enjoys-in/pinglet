import { dashboardService } from "@/handlers/services/dashboard.service";
import { cached } from "@/utils/helpers/cache";
import { CacheTTL } from "@/utils/types/cache";
import type { Request, Response } from "express";

class DashboardController {
	getStats = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const stats = await cached(
				`user:${userId}:dashboard:stats`,
				CacheTTL.SHORT,
				() => dashboardService.getStats(userId),
			);
			res.json({ message: "Dashboard Stats", result: stats, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getNotificationsChart = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const period = (req.query.period as string) || "weekly";
			const data = await cached(
				`user:${userId}:dashboard:notifications-chart:${period}`,
				CacheTTL.SHORT,
				() => dashboardService.getNotificationsChart(userId, period as any),
			);
			res.json({ message: "Notifications Chart", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getRatesChart = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const period = (req.query.period as string) || "weekly";
			const data = await cached(
				`user:${userId}:dashboard:rates-chart:${period}`,
				CacheTTL.SHORT,
				() => dashboardService.getRatesChart(userId, period as any),
			);
			res.json({ message: "Rates Chart", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};

	getSubscribers = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			const limit = Math.min(Number(req.query.limit) || 10, 100);
			const data = await cached(
				`user:${userId}:dashboard:subscribers:${limit}`,
				CacheTTL.BRIEF,
				() => dashboardService.getRecentSubscribers(userId, limit),
			);
			res.json({ message: "Recent Subscribers", result: data, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	};
}

export default new DashboardController();
