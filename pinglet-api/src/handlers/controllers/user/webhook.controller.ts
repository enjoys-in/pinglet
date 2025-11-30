import { webhookService } from "@/handlers/services/webhook.service";
import type { Request, Response } from "express";

class WebhookController {
    async getAllWebhooks(req: Request, res: Response) {
        try {
            const webhooks = await webhookService.getAllWebhooks();
            res
                .json({
                    message: "All Webhooks",
                    result: webhooks,
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

    async getWebhook(req: Request, res: Response) {
        try {
            const id = +req.params.id;
            const webhook = await webhookService.getWebhookById(id);
            res
                .json({
                    message: "Webhook Details",
                    result: webhook,
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

    async getWebhooksByUserId(req: Request, res: Response) {
        try {
            const userId = req.user?.id as number;
            const webhooks = await webhookService.getWebhooksByUserId(userId);
            res
                .json({
                    message: "User Webhooks",
                    result: webhooks,
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

    async createNewWebhook(req: Request, res: Response) {
        try {
            const body = req.body;
            const webhook = await webhookService.createNewWebhook({
                user_id: req.user?.id as number,
                type: body.triggerType,
                config: {
                    [body.triggerType]: body.config,
                },
                triggers_on: body.eventTrigger,
                name: body.name,
                description: body?.description,
            });
            res
                .json({
                    message: "Webhook Created",
                    result: {
                        id: webhook.id
                    },
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

    async updateWebhook(req: Request, res: Response) {
        try {
            const id = +req.params.id;
            const body = req.body;
            await webhookService.updateWebhook(id, body);
            res
                .json({
                    message: "Webhook Updated",
                    result: {
                        id
                    },
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

    async deleteWebhook(req: Request, res: Response) {
        try {
            const id = +req.params.id;
            await webhookService.deleteWebhook(id);
            res
                .json({
                    message: "Webhook Deleted",
                    result: null,
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

    async handleWebhook(req: Request, res: Response) {
        // Implement webhook handling logic here
        res.status(200).send('Webhook received successfully');
    }
}

export default new WebhookController();
