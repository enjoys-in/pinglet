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
import { PushSubscriptionEntity } from "./pushSubscription.entity";

@Entity("unsubscribe_logs")
export class UnsubscribeLogEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@Column()
	@Index()
	project_id!: string;

	@Column()
	endpoint!: string;

	@Column({ nullable: true })
	reason!: string; // "too_many" | "not_relevant" | "other" | user-provided string

	@Column({ nullable: true })
	feedback!: string;

	@Column({ nullable: true })
	user_agent!: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;
}
