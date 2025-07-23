import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
	UpdateDateColumn,
} from "typeorm";
import { NotificationEntity } from "./notifications.entity";
import { WebhookEntity } from "./webhook.entity";
import { WebsiteEntity } from "./website.entity";
import { TemplateCategoryEntity } from "./template-category.entity";
import { UserEntity } from "./users.entity";
import helpers from "@/utils/helpers";
import { ProjectConfig } from "@/utils/interfaces/project.interface";
import { PROJECT_DEFAULT_CONFIG } from "@/handlers/services/default/constant";


@Entity("projects")
@Unique(["unique_id"])
export class ProjectEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: "varchar", length: 255, unique: true })
	@Index()
	unique_id!: string;

	@Column({ type: "varchar", length: 255 })
	name!: string;

	@Column({ type: "text", nullable: true })
	description!: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	logo!: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	banner!: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@Column({ type: "jsonb", default: PROJECT_DEFAULT_CONFIG })
	config!: ProjectConfig;

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


	@ManyToOne(
		() => UserEntity,
		(u) => u.id,
	)
	@JoinColumn({ name: "user_id" })
	user!: Relation<UserEntity>;

	@OneToMany(
		() => NotificationEntity,
		(notif) => notif.project, {
		nullable: true
	}
	)
	notifications!: NotificationEntity[];

	@OneToOne(
		() => TemplateCategoryEntity,
		(p) => p.id, { nullable: true, onDelete: "SET NULL", }
	)
	@JoinColumn({ name: "category_id" })
	category!: Relation<TemplateCategoryEntity>;


	@OneToMany(
		() => WebhookEntity,
		(notif) => notif.project,
		{ nullable: true }
	)
	webhooks!: WebhookEntity[];

	@BeforeInsert()
	setProjectId() {
		this.unique_id = helpers.RandomToken(12);
	}
}
