import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	type Relation,
	UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./users.entity";

import helpers from "@/utils/helpers";
import type { WidgetProps } from "@/utils/interfaces/widgets.interface";

@Entity("widgets")
export class WidgetEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	widget_id!: string;

	@Column("jsonb")
	data!: WidgetProps;

	@Column("jsonb", { default: {}, nullable: true })
	style_props!: Record<string, any>;

	@Column({ default: true })
	is_active!: boolean;

	@ManyToOne(
		() => UserEntity,
		(u) => u.id,
		{ nullable: true, onDelete: "SET NULL" },
	)
	user!: Relation<UserEntity> | null;

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	@DeleteDateColumn({ nullable: true })
	deleted_at!: Date | null;

	@BeforeInsert()
	generateWidgetId() {
		this.widget_id = helpers.RandomToken(24);
	}
}
