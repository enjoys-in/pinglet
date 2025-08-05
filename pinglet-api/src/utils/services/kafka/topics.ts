export type EVENTS = "request" | "sent" | "failed" | "clicked" | "closed" | "dropped";

export enum ANALYTICS_EVENTS {
    NOTIFICATION_REQUEST = "notification.request",
    NOTIFICATION_SENT = "notification.sent",
    NOTIFICATION_FAILED = "notification.failed",
    NOTIFICATION_CLICKED = "notification.clicked",
    NOTIFICATION_CLOSED = "notification.closed",
    NOTIFICATION_DROPPED = "notification.dropped",
}
export enum NotificationEvents {
    Request = "request",
    SENT = "sent",
    FAILED = "failed",
    CLICKED = "clicked",
    CLOSED = "closed",
    DROPPED = "dropped",
}

export type KafkaTopic = `analytics.${ANALYTICS_EVENTS}`;


export enum KAFKA_TOPICS {
    NOTIFICATION_REQUEST = "analytics.notification.request",
    NOTIFICATION_SENT = "analytics.notification.sent",
    NOTIFICATION_FAILED = "analytics.notification.failed",
    NOTIFICATION_CLICKED = "analytics.notification.clicked",
    NOTIFICATION_CLOSED = "analytics.notification.closed",
    NOTIFICATION_DROPPED = "analytics.notification.dropped",
}