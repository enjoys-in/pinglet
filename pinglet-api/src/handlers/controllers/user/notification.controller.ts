import { notificationService } from "@/handlers/services/notifications.service";
import type { Request, Response } from "express";

class NotificationController {

    getAllNotifications = async (req: Request, res: Response) => {

        try {
            const isLatest = req.query?.latest === 'true'
            const limited = req.query?.limited === 'true'
            const query = req.query
            if (query?.page || query?.limit) {

            }
            const subscriptions = await notificationService.getNotifications({
                where: {
                    project: {
                        user: {
                            id: req.user!.id
                        }
                    }

                },
                select: {
                    id: true,
                    "is_active": true,
                    "total_request": true,
                    "total_sent": true,
                    "total_clicked": true,
                    "total_failed": true,
                    "total_closed": true,
                    "total_dropped": true,
                    "created_at": true,
                    project: {
                        id: true,
                        unique_id: true,
                        name: true,
                        website: {
                            id: true,
                            domain: true
                        }
                    }
                },
                relations: {
                    project: {
                        website: true
                    }
                },
                order: isLatest ? { created_at: 'DESC' } : { created_at: 'ASC' },
                take: limited ? 10 : 100
            });


            res
                .json({
                    message: "All subscriptions of User",
                    result: subscriptions,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }
    getNotification = async (req: Request, res: Response) => {

        try {
            if (!req.params?.id) {
                throw new Error("Invalid Request");
            }
            const notification = await notificationService.getNotificationById(+req.params.id);
            res
                .json({
                    message: "Logged In",
                    result: notification,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }

    getNotificationsByProjectId = async (req: Request, res: Response) => {

        try {
            const notifications = await notificationService.getNotifications({
                where: {
                    project_id: req.params.project_id,
                    project: {
                        user: {
                            id: req.user!.id
                        }
                    }
                }
            });

            res
                .json({
                    message: "All subscriptions",
                    result: notifications,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }
    getRawNotificationsByProjectId = async (req: Request, res: Response) => {

        try {
            const notifications = await notificationService.getRawNotificationsLogs(req.params.project_id);

            res
                .json({
                    message: "All subscriptions",
                    result: notifications,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }
    getRawNotification = async (req: Request, res: Response) => {

        try {
            const notifications = await notificationService.getRawNotificationsLog(req.params.id);

            res
                .json({
                    message: "All subscriptions",
                    result: notifications,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }


}

export default new NotificationController();
