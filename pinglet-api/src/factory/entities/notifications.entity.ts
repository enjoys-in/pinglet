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
import { TemplateCategoryEntity } from './template-category.entity';

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
	project!: Relation<ProjectEntity>;


	@Column()
	category_id!: string;

	@Column({ default: true })
	is_active!: boolean;


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
