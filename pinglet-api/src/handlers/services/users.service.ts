import { UserEntity } from "@/factory/entities/users.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";

class UserService {
	constructor(private readonly userRepo: Repository<UserEntity>) {
		this.userRepo = userRepo;
	}

	findUser(id: number): Promise<UserEntity | null>;
	findUser(email: string): Promise<UserEntity | null>;

	/**
	 * Finds a user by their id or email.
	 * @param payload The user id or email to search for.
	 * @returns A promise that resolves to the user if found, null otherwise.
	 */
	findUser(payload: number | string): Promise<UserEntity | null> {
		if (typeof payload === "number") {
			return this.userRepo.findOneBy({ id: payload });
		}
		return this.userRepo.findOneBy({ email: payload });
	}
	getUserBy(opts: FindManyOptions<UserEntity>) {
		return this.userRepo.findOne(opts);
	}
	getAllUsers() {
		return this.userRepo.find();
	}
	getAllUsersFilterBy(opts: FindManyOptions<UserEntity>) {
		return this.userRepo.find(opts);
	}
	deleteUser(id: number): Promise<any>;
	deleteUser(email: string): Promise<any>;
	deleteUser(payload: number | string): Promise<any> {
		if (typeof payload === "number") {
			return this.userRepo.softDelete({ id: payload });
		}
		return this.userRepo.softDelete({ email: payload });
	}
	createUser(user: DeepPartial<UserEntity>) {
		const newUser = this.userRepo.create(user);
		return this.userRepo.save(newUser);
	}
	exists(email: string): Promise<boolean> {
		return this.userRepo.exists({ where: { email } });
	}
	async updateUserPassword(
		email: string,
		newPassword: string,
	): Promise<UserEntity | null> {
		const user = await this.findUser(email);
		if (!user) {
			return null;
		}
		user.password = newPassword;
		return this.userRepo.save(user);
	}

}

export const userService = new UserService(InjectRepository(UserEntity));
