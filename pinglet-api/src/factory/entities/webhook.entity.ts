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
import { ProjectEntity } from "./project.entity";

export enum WebhookType {
	API = "api",
	TELEGRAM = "telegram",
	TEAMS = "teams",
	SLACK = "slack",
	DISCORD = "discord",
}

export enum WebhookEvent {
	SENT = "sent",
	CLICKED = "clicked",
	FAILED = "failed",
	DROPPED = "dropped",
}

@Entity("webhooks")
export class WebhookEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@ManyToOne(
		() => ProjectEntity,
		(project) => project.webhooks,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "project_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	project_id!: string;

	@Column({ type: "enum", enum: WebhookType })
	type!: WebhookType;

	@Column({ type: "jsonb", default: {} })
	config!: Record<string, any>;
	/*
    config examples:
    API:      { url: string }
    TELEGRAM: { botToken: string, chatId: string }
    TEAMS:    { webhookUrl: string }
    SLACK:    { webhookUrl: string }
  */

	@Column({
		type: "enum",
		enum: WebhookEvent,
		array: true,
		default: [WebhookEvent.SENT],
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

	@DeleteDateColumn({nullable: true})
	deleted_at!: Date|null;
}
