import type { EVENTS } from "./topics";

export interface NotificationEvent {
	event: string;
	timestamp: number;
	type: string;
	projectId: string;
	notificationId: string;
	metadata?: Record<string, any>;
}
