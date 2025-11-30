export interface WebhookResponse {
    id: number;
    name: string;
    description: string | null;
    user_id: number;
    type: WebhookType;
    config: Partial<WebhookConfig>;
    triggers_on: WebhookEvent[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export enum WebhookType {
    API = "api",
    TELEGRAM = "telegram",
    TEAMS = "teams",
    SLACK = "slack",
    DISCORD = "discord",
}
type WebhookPlatforms = `${WebhookType}`;
type TelegramConfigPayload = {
    botToken: string;
    chatId: string;
}
type WebhookConfigPayload = { url: string }


export type WebhookConfig = Partial<Record<WebhookPlatforms, WebhookConfigPayload>> & { telegram: TelegramConfigPayload };

export enum WebhookEvent {
    NOTIFICATION_SENT = "notification.sent",
    NOTIFICATION_DROPPED = "notification.dropped",
    NOTIFICATION_CLOSED = "notification.closed",
    NOTIFICATION_FAILED = "notification.failed",
    NOTIFICATION_CLICKED = "notification.clicked",
    USER_SUBSCRIBED = "user.subscribed",
    USER_UNSUBSCRIBED = "user.unsubscribed",
    PROJECT_CREATED = "project.created",
    DOMAIN_VERIFIED = "domain.verified",
}
