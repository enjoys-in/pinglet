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

@Entity("session_recordings")
export class SessionRecordingEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ManyToOne(() => ProjectEntity, (p) => p.unique_id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "project_id", referencedColumnName: "unique_id" })
	project!: Relation<ProjectEntity>;

	@Column()
	@Index()
	project_id!: string;

	@Column()
	@Index()
	visitor_id!: string;

	@Column("jsonb")
	events!: Record<string, any>[];

	@Column({ type: "int", default: 0 })
	duration_ms!: number;

	@Column({ nullable: true })
	page_url!: string;

	@Column({ nullable: true })
	user_agent!: string;

	@Column({ type: "int", default: 0 })
	event_count!: number;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;
}
