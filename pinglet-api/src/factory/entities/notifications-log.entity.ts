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

export enum NotificationStatus {
	SENT = "sent",
	CLICKED = "clicked",
	FAILED = "failed",
	DELIVERED = "delivered",
	DROPPED = "dropped",
}

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
	@Index()
	notification_id!: string;

	@Column({ type: "enum", enum: NotificationStatus })
	status!: NotificationStatus;

	@Column({ nullable: true })
	form_id!: string;

	@Column({ nullable: true })
	user_id!: string; // anonymous or registered user

	@Column({ nullable: true })
	ip_address!: string;

	@Column({ nullable: true })
	user_agent!: string;

	@CreateDateColumn()
	created_at!: Date;
}
