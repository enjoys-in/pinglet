import type { Request, Response } from "express";
import { notificationInboxService } from "@handlers/services/notification-inbox.service";

class InboxController {
	/**
	 * GET /inbox?projectId=xxx&subscriberId=yyy&limit=30&offset=0
	 */
	getInbox = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const subscriberId = req.query.subscriberId ? Number(req.query.subscriberId) : undefined;
			const limit = Math.min(Number(req.query.limit) || 30, 100);
			const offset = Number(req.query.offset) || 0;

			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}

			const items = await notificationInboxService.getInbox(projectId, subscriberId, limit, offset);
			const unreadCount = await notificationInboxService.getUnreadCount(projectId, subscriberId);
			res.json({ message: "OK", success: true, result: { items, unreadCount } });
		} catch (error) {
			res.json({ message: "Failed to get inbox", success: false }).end();
		}
	};

	/**
	 * PUT /inbox/:id/read — mark a single notification as read
	 */
	markAsRead = async (req: Request, res: Response) => {
		try {
			await notificationInboxService.markAsRead(req.params.id);
			res.json({ message: "OK", success: true });
		} catch (error) {
			res.json({ message: "Failed to mark as read", success: false }).end();
		}
	};

	/**
	 * PUT /inbox/read-all?projectId=xxx&subscriberId=yyy
	 */
	markAllAsRead = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const subscriberId = req.query.subscriberId ? Number(req.query.subscriberId) : undefined;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}
			await notificationInboxService.markAllAsRead(projectId, subscriberId);
			res.json({ message: "OK", success: true });
		} catch (error) {
			res.json({ message: "Failed to mark all as read", success: false }).end();
		}
	};

	/**
	 * DELETE /inbox/:id — soft-delete a notification from inbox
	 */
	deleteFromInbox = async (req: Request, res: Response) => {
		try {
			await notificationInboxService.deleteFromInbox(req.params.id);
			res.json({ message: "OK", success: true });
		} catch (error) {
			res.json({ message: "Failed to delete", success: false }).end();
		}
	};
}

export default new InboxController();
