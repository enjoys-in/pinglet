import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";

export enum PlanType {
	FREE = "free",
	STARTER = "starter",
	PROFESSIONAL = "professional",
	ENTERPRISE = "enterprise",
}

export interface PlanLimits {
	max_notifications_per_month: number; // -1 = unlimited
	max_widgets: number; // -1 = unlimited
	max_webhooks: number; // -1 = unlimited
	max_projects: number;
	max_templates: number; // -1 = unlimited
	features: {
		analytics_basic: boolean;
		analytics_advanced: boolean;
		ab_testing: boolean;
		basic_targeting: boolean;
		browser_notifications: boolean;
		custom_html_editor: boolean;
		white_label: boolean;
		advanced_api_access: boolean;
		integrations: boolean;
		integrations_limited: boolean;
		priority_support: boolean;
		media_audio_video: boolean;
	};
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
	[PlanType.FREE]: {
		max_notifications_per_month: 10_000,
		max_widgets: 5,
		max_webhooks: 0,
		max_projects: 1,
		max_templates: 5,
		features: {
			analytics_basic: true,
			analytics_advanced: false,
			ab_testing: false,
			basic_targeting: true,
			browser_notifications: false,
			custom_html_editor: false,
			white_label: false,
			advanced_api_access: false,
			integrations: false,
			integrations_limited: false,
			priority_support: false,
			media_audio_video: false,
		},
	},
	[PlanType.STARTER]: {
		max_notifications_per_month: 100_000,
		max_widgets: 100,
		max_webhooks: 0,
		max_projects: 5,
		max_templates: 20,
		features: {
			analytics_basic: true,
			analytics_advanced: false,
			ab_testing: false,
			basic_targeting: true,
			browser_notifications: false,
			custom_html_editor: false,
			white_label: false,
			advanced_api_access: false,
			integrations: true,
			integrations_limited: true,
			priority_support: false,
			media_audio_video: false,
		},
	},
	[PlanType.PROFESSIONAL]: {
		max_notifications_per_month: 500_000,
		max_widgets: 250,
		max_webhooks: 10,
		max_projects: 20,
		max_templates: 100,
		features: {
			analytics_basic: true,
			analytics_advanced: true,
			ab_testing: true,
			basic_targeting: true,
			browser_notifications: true,
			custom_html_editor: true,
			white_label: false,
			advanced_api_access: false,
			integrations: true,
			integrations_limited: true,
			priority_support: true,
			media_audio_video: true,
		},
	},
	[PlanType.ENTERPRISE]: {
		max_notifications_per_month: -1,
		max_widgets: -1,
		max_webhooks: -1,
		max_projects: -1,
		max_templates: -1,
		features: {
			analytics_basic: true,
			analytics_advanced: true,
			ab_testing: true,
			basic_targeting: true,
			browser_notifications: true,
			custom_html_editor: true,
			white_label: true,
			advanced_api_access: true,
			integrations: true,
			integrations_limited: false,
			priority_support: true,
			media_audio_video: true,
		},
	},
};

@Entity("plans")
export class Plan {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column({ type: "enum", enum: PlanType, unique: true })
	name!: PlanType;

	@Column({ type: "int" })
	price!: number;

	@Column({ type: "int", default: 0 })
	annual_price!: number;

	@Column("jsonb")
	details!: PlanLimits;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn({ nullable: true })
	deleted_at!: Date | null;
}
