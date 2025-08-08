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
	BASIC = "basic",
	PRO = "pro",
	TEAM = "team",
	ENTERPRISE = "enterprise",
}

const DEFAULT_PLAN = {
	[PlanType.FREE]: {
		max_projects: 1,
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

	@Column("jsonb")
	details!: Record<string, any>;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn({nullable: true})
	deleted_at!: Date|null;
}
