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

import { NotificationEntity } from "./notifications.entity";
import { ANALYTICS_EVENTS } from "@/utils/services/kafka/topics";



@Entity("notification_logs")
export class NotificationLogEntity {
	@PrimaryGeneratedColumn("uuid")
	id!: string;

	@ManyToOne(
		() => NotificationEntity,
		(notification) => notification.logs,
		{
			onDelete: "CASCADE",
		},
	)
	@JoinColumn({ name: "notification_id" })
	notification!: Relation<NotificationEntity>;

	@Column()
	notification_id!: string;

	@Column({ type: "enum", enum: ANALYTICS_EVENTS })
	event!: ANALYTICS_EVENTS;

	@Column({ nullable: true })
	type!: string;

	@Column({ nullable: true })
	triggered_at!: string;

	// @Column({ nullable: true })
	// form_id!: string;

	// @Column({ nullable: true })
	// user_id!: string; // anonymous or registered user

	// @Column({ nullable: true })
	// ip_address!: string;

	// @Column({ nullable: true })
	// user_agent!: string;

	@CreateDateColumn()
	created_at!: Date;
}
