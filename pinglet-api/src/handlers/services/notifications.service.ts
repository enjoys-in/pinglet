import { NotificationLogEntity } from "@/factory/entities/notifications-log.entity";
import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, FindOneOptions, Repository } from "typeorm";
class NotificationService {
	constructor(
		private readonly notificationRepo: Repository<NotificationEntity>,
		private readonly notificationLogRepo: Repository<NotificationLogEntity>,
	) {
		this.notificationRepo = notificationRepo;
		this.notificationLogRepo = notificationLogRepo;
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
	getNotification(opts: FindOneOptions<NotificationEntity>) {
		return this.notificationRepo.findOne(opts);
	}
	getNotificationsByProjectId(id: string) {
		return this.notificationRepo.find({ where: { project_id: id } });
	}
	getRawNotificationsLogs(project_id: string) {
		return this.notificationLogRepo.find({ where: { project_id: project_id } });
	}
	getRawNotificationsLog(id: string) {
		return this.notificationLogRepo.findOne({ where: { id } });

	}
}
export const notificationService = new NotificationService(
	InjectRepository(NotificationEntity),
	InjectRepository(NotificationLogEntity),
);
