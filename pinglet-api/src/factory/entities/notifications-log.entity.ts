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

import { ANALYTICS_EVENTS } from "@/utils/services/kafka/topics";
import { ProjectEntity } from "./project.entity";

@Entity("notification_logs")
export class NotificationLogEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ManyToOne(
		() => ProjectEntity,
		(project) => project.unique_id,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn({ name: "project_id", referencedColumnName: "unique_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	project_id!: string;

	@Column({ type: "enum", enum: ANALYTICS_EVENTS })
	event!: ANALYTICS_EVENTS;

	@Column({ nullable: true })
	type!: string;

	@Column({ nullable: true })
	triggered_at!: string;

	@Column({ nullable: true })
	notification_id!: string;

	@Column("jsonb", { nullable: true })
	metadata!: Record<string, any>;

	@DeleteDateColumn({ nullable: true })
	deleted_at!: Date | null;
}
