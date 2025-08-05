import type { Request, Response } from "express";
import { pushSubscriptionService } from "@/handlers/services/subscription.service";

class SubscriptionController {

    async getSubscriptionsByProjectId(req: Request, res: Response) {
        try {
            const subscriptions = await pushSubscriptionService.getSubscriptions({
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
    async getSubscriptionsOfUser(req: Request, res: Response) {
        try {
            const isLatest = req.query?.latest === 'true'
            const limited = req.query?.limited === 'true'
            const subscriptions = await pushSubscriptionService.getSubscriptions({
                where: {
                    project: {
                        user: {
                            id: req.user!.id
                        }
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
}

export default new SubscriptionController();
