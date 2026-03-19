import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { Plan, PlanType } from "./plan.entity";
import { UserSettingsEntity } from "./user-settings.entity";
import { WebhookEntity } from "./webhook.entity";
import { WebsiteEntity } from "./website.entity";

@Entity("users")
export class UserEntity {
	@PrimaryGeneratedColumn("increment")
	id!: number;

	@Column({ type: "varchar", length: 255, nullable: true })
	first_name!: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	last_name!: string;

	@Column({ type: "varchar", length: 255, unique: true })
	email!: string;

	@Column({ type: "varchar", length: 255, select: false })
	password!: string;

	@Column({ type: "enum", enum: PlanType, default: PlanType.FREE })
	plan_type!: PlanType;

	@ManyToOne(() => Plan, { nullable: true, eager: false })
	@JoinColumn({ name: "plan_id" })
	plan!: Plan | null;

	@Column({ nullable: true })
	plan_id!: string | null;

	@Column({ type: "varchar", length: 20, default: "monthly" })
	billing_cycle!: "monthly" | "annual";

	@Column({ type: "timestamp", nullable: true })
	plan_expires_at!: Date | null;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn()
	deleted_at!: Date | null;

	@Column({ type: "boolean", default: true })
	is_active!: boolean;

	@OneToOne(() => UserSettingsEntity)
	@JoinColumn({ name: "settings_id" })
	settings!: UserSettingsEntity;

	@OneToMany(
		() => WebsiteEntity,
		(website) => website.user,
	)
	@JoinColumn({ name: "website_id" })
	websites!: WebsiteEntity[];

	@OneToMany(
		() => WebhookEntity,
		(webhook) => webhook.user,
	)
	@JoinColumn({ name: "webhook_id" })
	webhooks!: WebhookEntity[];
}
