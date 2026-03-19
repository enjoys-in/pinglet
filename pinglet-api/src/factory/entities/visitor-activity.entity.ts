import {
	Column,
	CreateDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import { ProjectEntity } from "./project.entity";

@Entity("visitor_activity")
export class VisitorActivityEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ManyToOne(() => ProjectEntity, (p) => p.unique_id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "project_id", referencedColumnName: "unique_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	@Index()
	project_id!: string;

	@Column({ nullable: true })
	@Index()
	visitor_id!: string;

	@Column({ nullable: true })
	subscriber_id!: number;

	@Column({ type: "varchar", length: 50 })
	event_type!: string; // "page_view" | "session_start" | "session_end" | "custom"

	@Column({ nullable: true })
	page_url!: string;

	@Column({ nullable: true })
	page_title!: string;

	@Column({ nullable: true })
	referrer!: string;

	@Column({ type: "int", default: 0 })
	duration_ms!: number;

	@Column("jsonb", { nullable: true })
	metadata!: Record<string, any>;

	@Column({ nullable: true })
	user_agent!: string;

	@Column({ nullable: true })
	ip_hash!: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;
}
