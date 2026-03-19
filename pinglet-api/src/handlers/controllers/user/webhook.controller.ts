import { WebhookEvent } from "@/factory/entities/webhook.entity";
import { webhookService } from "@/handlers/services/webhook.service";
import { cached, invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation, CacheKeys, CacheTTL } from "@/utils/types/cache";
import { QueueService } from "@/utils/services/queue";
import { QUEUE_JOBS } from "@/utils/services/queue/name";
import type { Request, Response } from "express";

const triggerWebhookQueue = QueueService.createQueue("TRIGGER_WEBHOOK");

class WebhookController {
	async getAllWebhooks(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const webhooks = await cached(
				CacheKeys.userWebhooks(userId),
				CacheTTL.LONG,
				() => webhookService.getWebhooksByUserId(userId),
			);
			const result = webhooks.map((wh) => {
				const total = wh.success_count + wh.failure_count;
				return {
					...wh,
					triggers: total,
					success_rate: total > 0 ? Math.round((wh.success_count / total) * 10000) / 100 : 0,
				};
			});
			res.json({ message: "All Webhooks", result, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	}

	async getWebhook(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			const webhook = await webhookService.getWebhookById(id);
			if (!webhook) {
				res.json({ message: "Webhook not found", result: null, success: false }).end();
				return;
			}
			if (webhook.user_id !== (req.user?.id as number)) {
				res.json({ message: "Unauthorized", result: null, success: false }).end();
				return;
			}
			const total = webhook.success_count + webhook.failure_count;
			res.json({
				message: "Webhook Details",
				result: {
					...webhook,
					triggers: total,
					success_rate: total > 0 ? Math.round((webhook.success_count / total) * 10000) / 100 : 0,
				},
				success: true,
			}).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
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
			await invalidateCache(CacheInvalidation.webhook(req.user?.id as number));
			res
				.json({
					message: "Webhook Created",
					result: {
						id: webhook.id,
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
			await invalidateCache(CacheInvalidation.webhook(req.user?.id as number, id));
			res
				.json({
					message: "Webhook Updated",
					result: {
						id,
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
			await invalidateCache(CacheInvalidation.webhook(req.user?.id as number, id));
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
		res.status(200).send("Webhook received successfully");
	}

	async testWebhook(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			const webhook = await webhookService.getWebhookById(id);
			if (!webhook) {
				res.json({ message: "Webhook not found", result: null, success: false }).end();
				return;
			}
			if (webhook.user_id !== (req.user?.id as number)) {
				res.json({ message: "Unauthorized", result: null, success: false }).end();
				return;
			}
			await triggerWebhookQueue.add(
				QUEUE_JOBS.TRIGGER_WEBHOOK,
				{
					webhookId: webhook.id,
					webhookType: webhook.type,
					event: WebhookEvent.NOTIFICATION_SENT,
					config: webhook.config,
					projectId: "test",
					notificationType: "1",
					notificationData: { test: true, message: "This is a test webhook" },
					timestamp: Date.now(),
				},
				{
					removeOnComplete: true,
					jobId: `test-${webhook.id}-${Date.now()}`,
				},
			);
			res.json({ message: "Test webhook dispatched", result: { id }, success: true }).end();
		} catch (error) {
			if (error instanceof Error) {
				res.json({ message: error.message, result: null, success: false }).end();
				return;
			}
			res.json({ message: "Something went wrong", result: null, success: false }).end();
		}
	}
}

export default new WebhookController();
