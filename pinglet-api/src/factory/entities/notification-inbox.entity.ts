import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
} from "typeorm";
import { ProjectEntity } from "./project.entity";

@Entity("notification_inbox")
export class NotificationInboxEntity {
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
	subscriber_id!: number;

	@Column()
	title!: string;

	@Column({ nullable: true })
	body!: string;

	@Column({ nullable: true })
	icon!: string;

	@Column({ nullable: true })
	image!: string;

	@Column({ nullable: true })
	url!: string;

	@Column({ type: "varchar", length: 10, default: "0" })
	type!: string; // "0" | "1" | "-1"

	@Column("jsonb", { nullable: true })
	data!: Record<string, any>;

	@Column({ type: "boolean", default: false })
	is_read!: boolean;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@DeleteDateColumn({ nullable: true })
	deleted_at!: Date | null;
}
