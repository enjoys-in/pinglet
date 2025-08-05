// entities/Notification.ts
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,	
	PrimaryGeneratedColumn,
	Relation,
	UpdateDateColumn,
} from "typeorm";

import { ProjectEntity } from "./project.entity";

@Entity("notifications")
export class NotificationEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ManyToOne(
		() => ProjectEntity,
		(project) => project.unique_id,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "project_id", referencedColumnName: "unique_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	@Index("unique_project", ["project_id"], { unique: true })
	project_id!: string;

	@Column({ default: true })
	is_active!: boolean;

	@Column({ type: "int", default: 0 })
	total_request!: number;

	@Column({ type: "int", default: 0 })
	total_sent!: number;

	@Column({ type: "int", default: 0 })
	total_clicked!: number;

	@Column({ type: "int", default: 0 })
	total_failed!: number;

	@Column({ type: "int", default: 0 })
	total_closed!: number;

	@Column({ type: "int", default: 0 })
	total_dropped!: number;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;



}
