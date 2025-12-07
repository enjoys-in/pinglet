import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";

import { UserEntity } from "./users.entity";

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
};
type WebhookConfigPayload = { url: string };

export type WebhookConfig = Partial<
	Record<WebhookPlatforms, WebhookConfigPayload>
> & { telegram: TelegramConfigPayload };

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

@Entity("webhooks")
export class WebhookEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ nullable: true })
	name!: string;

	@Column({ nullable: true })
	description!: string;

	@ManyToOne(
		() => UserEntity,
		(user) => user.webhooks,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "user_id" })
	user!: Relation<UserEntity>;

	@Column()
	user_id!: number;

	@Column({ type: "enum", enum: WebhookType })
	type!: WebhookType;

	@Column({ type: "jsonb", default: {} })
	config!: Partial<WebhookConfig>;

	@Column({
		type: "enum",
		enum: WebhookEvent,
		array: true,
		default: [],
	})
	triggers_on!: WebhookEvent[];

	@Column({ default: true })
	is_active!: boolean;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@CreateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn({ nullable: true })
	deleted_at!: Date | null;
}
