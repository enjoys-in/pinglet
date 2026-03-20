import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from "typeorm";

import { UserEntity } from "./users.entity";
import { ProjectEntity } from "./project.entity";

export enum FlowStatus {
	DRAFT = "draft",
	ACTIVE = "active",
	PAUSED = "paused",
}

export enum FlowNodeType {
	EVENT_TRIGGER = "event_trigger",
	CONDITION = "condition",
	DELAY = "delay",
	NOTIFICATION = "notification",
	WEBHOOK = "webhook",
	AB_SPLIT = "ab_split",
	FILTER = "filter",
	SCHEDULE = "schedule",
	RATE_LIMIT = "rate_limit",
	PRESENCE_CHECK = "presence_check",
	TRANSFORM = "transform",
	EMAIL = "email",
	MERGE = "merge",
	DIVERGE = "diverge",
	NOTE = "note",
}

@Entity("flows")
@Index("idx_flow_user", ["user_id"])
@Index("idx_flow_project", ["project_id"])
export class FlowEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	name!: string;

	@Column({ nullable: true })
	description!: string;

	@Column({ type: "enum", enum: FlowStatus, default: FlowStatus.DRAFT })
	status!: FlowStatus;

	@Column({ type: "jsonb", default: [] })
	nodes!: Array<{
		id: string;
		type: string;
		data: Record<string, any>;
		position: { x: number; y: number };
	}>;

	@Column({ type: "jsonb", default: [] })
	edges!: Array<{
		id: string;
		source: string;
		target: string;
		sourceHandle?: string | null;
		label?: string;
	}>;

	// ─── Relations ───

	@ManyToOne(() => UserEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user!: Relation<UserEntity>;

	@Column()
	user_id!: number;

	@ManyToOne(() => ProjectEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "project_id", referencedColumnName: "unique_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	project_id!: string;

	// ─── Counters (populated by execution engine) ───

	@Column({ type: "int", default: 0 })
	total_executions!: number;

	@Column({ type: "int", default: 0 })
	total_notifications_sent!: number;

	@Column({ type: "int", default: 0 })
	total_errors!: number;

	@Column({ nullable: true, type: "timestamp" })
	last_executed_at!: Date | null;

	// ─── Timestamps ───

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	updated_at!: Date;
}
