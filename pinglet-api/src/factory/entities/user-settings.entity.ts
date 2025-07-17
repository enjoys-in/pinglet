import {
	Column,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryColumn,
	type Relation,
} from "typeorm";
import { UserEntity } from "./users.entity";

@Entity("user_settings")
export class UserSettingsEntity {
	@PrimaryColumn()
	id!: number;

	@OneToOne(
		() => UserEntity,
		(user) => user.settings,
	)
	@JoinColumn()
	user!: Relation<UserEntity>;

	@Column({ type: "boolean", default: false })
	is_notification_enabled!: boolean;
}
