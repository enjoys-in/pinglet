import type { Request, Response } from "express";
import { unsubscribeAnalyticsService } from "@handlers/services/unsubscribe-analytics.service";

class UnsubscribeAnalyticsController {
	/**
	 * GET /unsubscribe-analytics?projectId=xxx
	 */
	getReasonBreakdown = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}
			const breakdown = await unsubscribeAnalyticsService.getReasonBreakdown(projectId);
			res.json({ message: "OK", success: true, result: breakdown });
		} catch (error) {
			res.json({ message: "Failed to get breakdown", success: false }).end();
		}
	};

	/**
	 * GET /unsubscribe-analytics/trend?projectId=xxx&days=30
	 */
	getUnsubscribeTrend = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const days = Math.min(Number(req.query.days) || 30, 90);
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}
			const trend = await unsubscribeAnalyticsService.getTrend(projectId, days);
			res.json({ message: "OK", success: true, result: trend });
		} catch (error) {
			res.json({ message: "Failed to get trend", success: false }).end();
		}
	};

	/**
	 * GET /unsubscribe-analytics/logs?projectId=xxx&limit=50&offset=0
	 */
	getLogs = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const limit = Math.min(Number(req.query.limit) || 50, 100);
			const offset = Number(req.query.offset) || 0;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}
			const logs = await unsubscribeAnalyticsService.getUnsubscribeLogs(projectId, limit, offset);
			res.json({ message: "OK", success: true, result: logs });
		} catch (error) {
			res.json({ message: "Failed to get logs", success: false }).end();
		}
	};

	/**
	 * GET /unsubscribe-analytics/summary — per-project breakdown for user
	 */
	getSummary = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", success: false });
				return;
			}
			const summary = await unsubscribeAnalyticsService.getUnsubscribesByProject(userId);
			res.json({ message: "OK", success: true, result: summary });
		} catch (error) {
			res.json({ message: "Failed to get summary", success: false }).end();
		}
	};
}

export default new UnsubscribeAnalyticsController();
