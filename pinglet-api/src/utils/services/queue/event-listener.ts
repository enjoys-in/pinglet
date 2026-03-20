import type {
	WebhookEvent,
	WebhookType,
} from "@/factory/entities/webhook.entity";
import { projectService } from "@/handlers/services/project.service";
import { webhookService } from "@/handlers/services/webhook.service";
import { OnEvent } from "@/utils/decorators";
import { invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation } from "@/utils/types/cache";
import { MailService } from "@/utils/services/mail/mailService";
import { AppEvents } from "@/utils/services/Events";
import { QueueService } from ".";
import { QUEUE_JOBS } from "./name";
const triggerWebhookQueue = QueueService.createQueue("TRIGGER_WEBHOOK");
const mailer = MailService.getInstance();

// ─── Fire-and-forget cache invalidation for hot-path notification lookups ───
// Emitters send: { projectId: string } or { projectIds: string[] }
AppEvents.on("invalidateNtfyCache", (payload: { projectId?: string; projectIds?: string[] }) => {
	const ids = payload.projectIds || (payload.projectId ? [payload.projectId] : []);
	const keys = ids.flatMap((pid) => CacheInvalidation.ntfyProject(pid));
	if (keys.length > 0) invalidateCache(keys).catch(() => {});
});

export class EventListeners {
	constructor() {
		console.log("EventListeners");
	}

	// Removed broken resetPassword event listener — was emailing plain-text passwords
	// and had JSON.parse on non-string payload, undefined adminEmail, and decorator registration issues
	@OnEvent("triggerWebhook", { async: true })
	private async triggerWebhook(payload: any) {
		try {
			const data = JSON.parse(payload) as {
				webhookType: WebhookType;
				event: WebhookEvent;
				projectId: string;
				userId?: number;
				notificationType: "1" | "0" | "-1";
				notificationData: Record<string, any>;
			};

			let userId = data.userId;
			if (!userId && data.projectId) {
				const project = await projectService.getSelectedProjects({
					where: { unique_id: data.projectId },
					select: { id: true, user: { id: true } },
					relations: { user: true },
				});
				userId = project?.user?.id;
			}

			if (!userId) return;

			const webhooks = await webhookService.getWebhooksByEvent(
				userId,
				data.event,
			);

			for (const wh of webhooks) {
				await triggerWebhookQueue.add(
					QUEUE_JOBS.TRIGGER_WEBHOOK,
					{
						webhookId: wh.id,
						webhookType: wh.type,
						event: data.event,
						config: wh.config,
						projectId: data.projectId,
						notificationType: data.notificationType,
						notificationData: data.notificationData,
						timestamp: Date.now(),
					},
					{
						removeOnComplete: true,
						jobId: `${wh.id}-${data.projectId}-${data.event}-${Date.now()}`,
						attempts: 3,
						backoff: {
							type: "exponential",
							delay: 5000, // 5s, 10s, 20s
						},
					},
				);
			}
		} catch (err) {
			console.error("triggerWebhook event handler error:", err);
		}
	}
}
