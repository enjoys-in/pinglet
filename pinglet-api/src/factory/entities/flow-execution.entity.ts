import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";

import { FlowEntity } from "./flow.entity";

export enum FlowExecutionStatus {
	RUNNING = "running",
	COMPLETED = "completed",
	FAILED = "failed",
}

@Entity("flow_executions")
@Index("idx_exec_flow", ["flow_id"])
@Index("idx_exec_project", ["project_id"])
export class FlowExecutionEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ManyToOne(() => FlowEntity, { onDelete: "CASCADE" })
	@JoinColumn({ name: "flow_id" })
	flow!: Relation<FlowEntity>;

	@Column("uuid")
	flow_id!: string;

	@Column()
	project_id!: string;

	@Column({ type: "enum", enum: FlowExecutionStatus, default: FlowExecutionStatus.RUNNING })
	status!: FlowExecutionStatus;

	@Column({ nullable: true })
	trigger_event!: string;

	@Column({ type: "jsonb", nullable: true })
	trigger_payload!: Record<string, any> | null;

	@Column({ type: "jsonb", default: [] })
	execution_log!: Array<{
		node_id: string;
		node_type: string;
		status: "success" | "error" | "skipped";
		started_at: string;
		ended_at?: string;
		error?: string;
		output?: Record<string, any>;
	}>;

	@Column({ type: "int", default: 0 })
	nodes_executed!: number;

	@Column({ type: "int", default: 0 })
	notifications_sent!: number;

	@Column({ nullable: true })
	error_message!: string ;

	@Column({ type: "int", default: 0 })
	duration_ms!: number;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@Column({ nullable: true, type: "timestamp" })
	completed_at!: Date;
}
