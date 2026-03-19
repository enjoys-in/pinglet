import type {
	WebhookEvent,
	WebhookType,
} from "@/factory/entities/webhook.entity";
import { OnEvent } from "@/utils/decorators";
import { MailService } from "@/utils/services/mail/mailService";
import { QueueService } from ".";
import { QUEUE_JOBS } from "./name";
const triggerWebhookQueue = QueueService.createQueue("TRIGGER_WEBHOOK");
const mailer = MailService.getInstance();
export class EventListeners {
	constructor() {
		console.log("EventListeners");
	}

	// Removed broken resetPassword event listener — was emailing plain-text passwords
	// and had JSON.parse on non-string payload, undefined adminEmail, and decorator registration issues
	@OnEvent("triggerWebhook", { async: true })
	private async triggerWebhook(payload: any) {
		console.log("first");
		const data = JSON.parse(payload) as {
			webhookType: WebhookType.API;
			event: WebhookEvent.NOTIFICATION_SENT;
			projectId: string;
			notificationType: "1" | "0" | "-1";
			notificationData: Record<string, any>;
		};
		console.log(data);
		// await triggerWebhookQueue.add(QUEUE_JOBS.TRIGGER_WEBHOOK, data, {
		//     removeOnComplete: true,
		//     jobId: `${data.projectId}-${data.event}`
		// })
	}
}
