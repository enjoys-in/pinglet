// entities/Notification.ts
import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
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

	@Column()
	template!: string;

	@ManyToOne(
		() => ProjectEntity,
		(project) => project.category,
		{ onDelete: "CASCADE" },
	)
	@JoinColumn({ name: "project_id" })
	project!: string;


	@Column({ nullable: true })
	category_id!: string;

	@Column({ default: true })
	is_active!: boolean;


	@Column()
	@Index("unique_project", ["project_id"], { unique: true })
	project_id!: string;

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

	@OneToMany(
		() => NotificationLogEntity,
		(log) => log.notification,
	)
	logs!: NotificationLogEntity[];


}
