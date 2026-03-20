/**
 * Canonical notification lifecycle events.
 * This is the SINGLE source of truth — used by Kafka, webhooks, SDK, activity tracking, and frontend.
 *
 * Frontend should only allow users to subscribe to these events for webhooks/flows.
 */
export enum NotificationLifecycleEvent {
	/** API received a send request */
	REQUEST = "request",
	/** Notification entered the BullMQ queue (push only) */
	QUEUED = "queued",
	/** Notification dispatched to browser / SSE client */
	SENT = "sent",
	/** Push notification confirmed delivered by browser */
	DELIVERED = "delivered",
	/** User clicked the notification */
	CLICKED = "clicked",
	/** User explicitly dismissed (X button / swipe away) */
	DISMISSED = "dismissed",
	/** Notification auto-closed (timeout / replaced) */
	CLOSED = "closed",
	/** Notification dropped (quiet hours, quota, invalid subscription, etc.) */
	DROPPED = "dropped",
	/** Send failed (webpush error, network, etc.) */
	FAILED = "failed",
}

/** All allowed lifecycle values — expose to frontend for webhook / flow config */
export const ALLOWED_NOTIFICATION_EVENTS = Object.values(NotificationLifecycleEvent);

// ── Legacy aliases (keep existing consumers working) ──

export type EVENTS =
	| "request"
	| "sent"
	| "failed"
	| "clicked"
	| "closed"
	| "dropped"
	| "queued"
	| "delivered"
	| "dismissed";

export enum ANALYTICS_EVENTS {
	NOTIFICATION_REQUEST = "notification.request",
	NOTIFICATION_SENT = "notification.sent",
	NOTIFICATION_FAILED = "notification.failed",
	NOTIFICATION_CLICKED = "notification.clicked",
	NOTIFICATION_CLOSED = "notification.closed",
	NOTIFICATION_DROPPED = "notification.dropped",
	NOTIFICATION_QUEUED = "notification.queued",
	NOTIFICATION_DELIVERED = "notification.delivered",
	NOTIFICATION_DISMISSED = "notification.dismissed",
}
export enum NotificationEvents {
	Request = "request",
	SENT = "sent",
	FAILED = "failed",
	CLICKED = "clicked",
	CLOSED = "closed",
	DROPPED = "dropped",
	QUEUED = "queued",
	DELIVERED = "delivered",
	DISMISSED = "dismissed",
}

export type KafkaTopic = `analytics.${ANALYTICS_EVENTS}`;

export enum KAFKA_TOPICS {
	NOTIFICATION_REQUEST = "analytics.notification.request",
	NOTIFICATION_SENT = "analytics.notification.sent",
	NOTIFICATION_FAILED = "analytics.notification.failed",
	NOTIFICATION_CLICKED = "analytics.notification.clicked",
	NOTIFICATION_CLOSED = "analytics.notification.closed",
	NOTIFICATION_DROPPED = "analytics.notification.dropped",
	NOTIFICATION_QUEUED = "analytics.notification.queued",
	NOTIFICATION_DELIVERED = "analytics.notification.delivered",
	NOTIFICATION_DISMISSED = "analytics.notification.dismissed",
}
