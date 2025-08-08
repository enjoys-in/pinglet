import { NotificationLogEntity } from "@/factory/entities/notifications-log.entity";
import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { DeepPartial, FindManyOptions, FindOneOptions, Repository } from "typeorm";
class AnalyticsService {
    constructor(
        private readonly notificationRepo: Repository<NotificationEntity>,

    ) {
        this.notificationRepo = notificationRepo;

    }

    getAllAcrossWebsites() {
        return this.notificationRepo
            .createQueryBuilder("notifications")
            .innerJoin("notifications.project_id", "project")
            .innerJoin("project.website", "website")
            .select("website.id", "website_id")
            .addSelect("SUM(notification.total_sent)", "total_sent")
            .addSelect("SUM(notification.total_request)", "total_request")
            .groupBy("website.id")
            .getRawMany();

    }
    getPerProject() {
        return this.notificationRepo.createQueryBuilder('notifications')
            .select('notifications.project_id', 'project_id')
            .addSelect('SUM(notification.total_sent)', 'total_sent')
            .addSelect('SUM(notification.total_request)', 'total_request')
            .groupBy('notification.project_id')
            .getRawMany();
    }
    getPerWebsite() {
        return this.notificationRepo.createQueryBuilder('notifications')
            .innerJoin('notifications.project_id', 'project')
            .innerJoin('project.website', 'website')
            .select('website.id', 'website_id')
            .addSelect('SUM(notification.total_sent)', 'total_sent')
            .addSelect('SUM(notification.total_request)', 'total_request')
            .groupBy('website.id')
            .getRawMany();
    }
}
export const notificationService = new AnalyticsService(
    InjectRepository(NotificationEntity),

);
