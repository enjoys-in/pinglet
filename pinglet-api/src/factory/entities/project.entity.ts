import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from "typeorm";
import { NotificationEntity } from "./notifications.entity";
import { WebhookEntity } from "./webhook.entity";
import { WebsiteEntity } from "./website.entity";

@Entity("projects")
export class ProjectEntity {
	@PrimaryGeneratedColumn()
	id!: string;

	@Column({ type: "varchar", length: 255 })
	name!: string;

	@Column({ type: "text" })
	description!: string;

	@Column({ type: "varchar", length: 255 })
	logo!: string;

	@Column({ type: "varchar", length: 255 })
	banner!: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@Column({ type: "boolean", default: true })
	is_active!: boolean;

	@ManyToOne(
		() => WebsiteEntity,
		(website) => website.projects,
	)
	@JoinColumn({ name: "website_id" })
	website!: Relation<WebsiteEntity>;

	@OneToMany(
		() => NotificationEntity,
		(notif) => notif.project,
	)
	notifications!: NotificationEntity[];

	@OneToMany(
		() => WebhookEntity,
		(notif) => notif.project,
	)
	webhooks!: WebhookEntity[];
}
