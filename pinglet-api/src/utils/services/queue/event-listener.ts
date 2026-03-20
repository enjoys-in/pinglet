import {
	WebhookEvent,
	WebhookType,
} from "@/factory/entities/webhook.entity";
import { projectService } from "@/handlers/services/project.service";
import { webhookService } from "@/handlers/services/webhook.service";
import { notificationInboxService } from "@/handlers/services/notification-inbox.service";
import { OnEvent } from "@/utils/decorators";
import { invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation } from "@/utils/types/cache";
import { MailService } from "@/utils/services/mail/mailService";
import { AppEvents } from "@/utils/services/Events";
import { NotificationLifecycleEvent } from "@/utils/services/kafka/topics";
import { dispatchFlows } from "@/utils/services/flow-engine";
import { QueueService } from ".";
import { QUEUE_JOBS } from "./name";
const triggerWebhookQueue = QueueService.createQueue("TRIGGER_WEBHOOK");
const sendToKafkaQueue = QueueService.createQueue("SEND_KAFKA_NOTIFICATION");
const mailer = MailService.getInstance();

// ─── Lifecycle → WebhookEvent mapping ───
const LIFECYCLE_TO_WEBHOOK: Partial<Record<NotificationLifecycleEvent, WebhookEvent>> = {
	[NotificationLifecycleEvent.SENT]: WebhookEvent.NOTIFICATION_SENT,
	[NotificationLifecycleEvent.FAILED]: WebhookEvent.NOTIFICATION_FAILED,
	[NotificationLifecycleEvent.DROPPED]: WebhookEvent.NOTIFICATION_DROPPED,
	[NotificationLifecycleEvent.CLICKED]: WebhookEvent.NOTIFICATION_CLICKED,
	[NotificationLifecycleEvent.CLOSED]: WebhookEvent.NOTIFICATION_CLOSED,
	[NotificationLifecycleEvent.QUEUED]: WebhookEvent.NOTIFICATION_QUEUED,
	[NotificationLifecycleEvent.DELIVERED]: WebhookEvent.NOTIFICATION_DELIVERED,
	[NotificationLifecycleEvent.DISMISSED]: WebhookEvent.NOTIFICATION_DISMISSED,
};

// ─── Payload shape for the unified lifecycle event ───
export interface LifecycleEventPayload {
	event: NotificationLifecycleEvent | string;
	projectId: string;
	userId?: number;
	type?: string;           // notification type: "0" | "1" | "-1"
	notificationId?: string;
	data?: Record<string, any>;
}

// ─── Fire-and-forget cache invalidation for hot-path notification lookups ───
AppEvents.on("invalidateNtfyCache", (payload: { projectId?: string; projectIds?: string[] }) => {
	const ids = payload.projectIds || (payload.projectId ? [payload.projectId] : []);
	const keys = ids.flatMap((pid) => CacheInvalidation.ntfyProject(pid));
	if (keys.length > 0) invalidateCache(keys).catch(() => {});
});

// ─── Fire-and-forget inbox store ───
AppEvents.on("storeInbox", (payload: {
	project_id: string;
	title: string;
	body: string;
	icon: string;
	image: string;
	url: string;
	type: string;
	data: Record<string, any>;
}) => {
	notificationInboxService.addToInbox(payload).catch(() => {});
});

// ─── Unified notification lifecycle handler ───
// ONE event → Kafka log + webhook dispatch + flow execution (all fire-and-forget)
AppEvents.on("notificationLifecycle", async (payload: LifecycleEventPayload) => {
	const ts = Date.now();

	// 1. Log to Kafka (analytics / activity tracking)
	sendToKafkaQueue.add(QUEUE_JOBS.SEND_KAFKA_NOTIFICATION, {
		project_id: payload.projectId,
		timestamp: ts,
		type: payload.type || "0",
		event: payload.event,
		notification_id: payload.notificationId,
		...(payload.data || {}),
	}, {
		removeOnComplete: true,
		jobId: `${payload.projectId}-${ts}-${payload.event}`,
	}).catch(() => {});

	// 2. Dispatch matching active flows (event-driven)
	dispatchFlows(
		payload.projectId,
		payload.event,
		{ ...payload.data, projectId: payload.projectId, event: payload.event },
		payload.userId,
	).catch(() => {});

	// 2. Dispatch matching webhooks
	const webhookEvent = LIFECYCLE_TO_WEBHOOK[payload.event as NotificationLifecycleEvent];
	if (!webhookEvent) return;

	try {
		let userId = payload.userId;
		if (!userId && payload.projectId) {
			const project = await projectService.getSelectedProjects({
				where: { unique_id: payload.projectId },
				select: { id: true, user: { id: true } },
				relations: { user: true },
			});
			userId = project?.user?.id;
		}
		if (!userId) return;

		const webhooks = await webhookService.getWebhooksByEvent(userId, webhookEvent);
		for (const wh of webhooks) {
			triggerWebhookQueue.add(
				QUEUE_JOBS.TRIGGER_WEBHOOK,
				{
					webhookId: wh.id,
					webhookType: wh.type,
					event: webhookEvent,
					config: wh.config,
					projectId: payload.projectId,
					notificationType: payload.type || "0",
					notificationData: payload.data || {},
					timestamp: ts,
				},
				{
					removeOnComplete: true,
					jobId: `${wh.id}-${payload.projectId}-${webhookEvent}-${ts}`,
					attempts: 3,
					backoff: { type: "exponential", delay: 5000 },
				},
			).catch(() => {});
		}
	} catch (err) {
		console.error("notificationLifecycle webhook dispatch error:", err);
	}
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
