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
	type Relation,
	UpdateDateColumn,
} from "typeorm";
import { ProjectEntity } from "./project.entity";
import { TemplatesEntity } from "./templates.entity";
import { UserEntity } from "./users.entity";

@Entity("template_category")
export class TemplateCategoryEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column({ unique: true })
	slug!: string;

	@Column({ nullable: true })
	description!: string;

	@Column({ default: true })
	is_active!: boolean;

	@OneToMany(
		() => TemplatesEntity,
		(t) => t.category,
		{ nullable: true },
	)
	templates!: TemplatesEntity[];

	@ManyToOne(
		() => UserEntity,
		(u) => u.id,
		{ nullable: true, onDelete: "SET NULL" },
	)
	@JoinColumn({ name: "user_id" })
	user!: Relation<UserEntity> | null;

	@OneToMany(
		() => ProjectEntity,
		(u) => u.category,
	)
	@JoinColumn()
	project!: ProjectEntity[];

	@CreateDateColumn()
	created_at!: Date;

	@UpdateDateColumn()
	updated_at!: Date;

	@DeleteDateColumn()
	deleted_at!: Date | null;
}
