import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { UserSettingsEntity } from "./user-settings.entity";
import { WebsiteEntity } from "./website.entity";

@Entity("users")
export class UserEntity {
	@PrimaryGeneratedColumn("increment")
	id!: number;

	@Column({ type: "varchar", length: 255, nullable: true })
	first_name!: string;

	@Column({ type: "varchar", length: 255, nullable: true })
	last_name!: string;

	@Column({ type: "varchar", length: 255, unique: true })
	email!: string;

	@Column({ type: "varchar", length: 255 })
	password!: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: Date;

	@UpdateDateColumn({
		type: "timestamp",
		default: () => "CURRENT_TIMESTAMP",
		onUpdate: "CURRENT_TIMESTAMP",
	})
	updated_at!: Date;

	@DeleteDateColumn()
	deleted_at!: Date|null;

	@Column({ type: "boolean", default: true })
	is_active!: boolean;

	@OneToOne(() => UserSettingsEntity)
	@JoinColumn({ name: "settings_id" })
	settings!: UserSettingsEntity;

	@OneToMany(
		() => WebsiteEntity,
		(website) => website.user,
	)
	@JoinColumn({ name: "website_id" })
	websites!: WebsiteEntity[];
}
