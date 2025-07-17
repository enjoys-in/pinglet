import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, Repository } from "typeorm";
class NotificationService {
	constructor(
		private readonly notificationRepo: Repository<NotificationEntity>,
	) {
		this.notificationRepo = notificationRepo;
	}

	createNewNotification(data: DeepPartial<NotificationEntity>) {
		const newNotification = this.notificationRepo.create(data);
		return this.notificationRepo.save(newNotification);
	}
	getNotificationById(id: number) {
		return this.notificationRepo.findOneBy({ id: id.toString() });
	}
	getNotifications(opts: FindManyOptions<NotificationEntity>) {
		return this.notificationRepo.find(opts);
	}
	getNotificationsByProjectId(id: string) {
		return this.notificationRepo.find({ where: { project_id: id } });
	}
}
export const notificationService = new NotificationService(
	InjectRepository(NotificationEntity),
);
