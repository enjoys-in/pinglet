// entities/Notification.ts
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from "typeorm";
import { NotificationLogEntity } from "./notifications-log.entity";
import { ProjectEntity } from "./project.entity";

@Entity("notifications")
export class NotificationEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	name!: string;

	@Column({ type: "text" })
	template!: string;

	@Column({ type: "jsonb", default: {} })
	variables!: Record<string, string>; // Default vars or schema

	@Column({ default: true })
	is_active!: boolean;

	@ManyToOne(
		() => ProjectEntity,
		(project) => project.notifications,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "project_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	project_id!: string;

	@Column({ type: "int", default: 0 })
	total_sent!: number;

	@Column({ type: "int", default: 0 })
	total_clicked!: number;

	@Column({ type: "int", default: 0 })
	total_failed!: number;

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

	@OneToMany(
		() => NotificationLogEntity,
		(log) => log.notification,
	)
	logs!: NotificationLogEntity[];
}
