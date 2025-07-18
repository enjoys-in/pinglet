import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	Index,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	type Relation,
	Unique,
	UpdateDateColumn,
} from "typeorm";
import { ProjectEntity } from "./project.entity";
import { UserEntity } from "./users.entity";

@Entity("websites")
export class WebsiteEntity {
	@PrimaryGeneratedColumn("increment")
	id!: number;
	@Column({ type: "varchar",  length: 255 })	 
	name!: string;

	@Column({ type: "varchar", default: [], array: true ,nullable: true })	 
	tags!: string[];

	@Column({ type: "varchar", unique: true, length: 255 })
	@Index()
	domain!: string;

	@ManyToOne(
		() => UserEntity,
		(user) => user.websites,
	)
	user!: Relation<UserEntity>;

	@Column({ type: "boolean", default: true })
	is_active!: boolean;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn()
	deleted_at?: Date;

	@OneToMany(
		() => ProjectEntity,
		(project) => project.website,
	)
	projects!: ProjectEntity[];
}
