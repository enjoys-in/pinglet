import { NotificationLogEntity } from "@/factory/entities/notifications-log.entity";
import { NotificationEntity } from "@/factory/entities/notifications.entity";
import { InjectRepository } from "@/factory/typeorm";
import type {
	DeepPartial,
	FindManyOptions,
	FindOneOptions,
	Repository,
} from "typeorm";
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
	async getStatsByUserId(userId: number) {
		const now = new Date();
		const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

		const currentStats = await this.notificationRepo
			.createQueryBuilder("n")
			.innerJoin("n.project", "project")
			.where("project.user_id = :userId", { userId })
			.select("COALESCE(SUM(n.total_sent), 0)", "total_sent")
			.addSelect("COALESCE(SUM(n.total_request), 0)", "total_request")
			.addSelect("COALESCE(SUM(n.total_clicked), 0)", "total_clicked")
			.addSelect("COALESCE(SUM(n.total_failed), 0)", "total_failed")
			.addSelect("COALESCE(SUM(n.total_closed), 0)", "total_closed")
			.addSelect("COALESCE(SUM(n.total_dropped), 0)", "total_dropped")
			.getRawOne();

		const lastWeekLogs = await this.notificationLogRepo
			.createQueryBuilder("log")
			.innerJoin("projects", "project", "project.unique_id = log.project_id")
			.where("project.user_id = :userId", { userId })
			.andWhere("log.triggered_at >= :oneWeekAgo", { oneWeekAgo: oneWeekAgo.toISOString() })
			.select("log.event", "event")
			.addSelect("COUNT(*)", "count")
			.groupBy("log.event")
			.getRawMany();

		const prevWeekLogs = await this.notificationLogRepo
			.createQueryBuilder("log")
			.innerJoin("projects", "project", "project.unique_id = log.project_id")
			.where("project.user_id = :userId", { userId })
			.andWhere("log.triggered_at >= :twoWeeksAgo", { twoWeeksAgo: twoWeeksAgo.toISOString() })
			.andWhere("log.triggered_at < :oneWeekAgo", { oneWeekAgo: oneWeekAgo.toISOString() })
			.select("log.event", "event")
			.addSelect("COUNT(*)", "count")
			.groupBy("log.event")
			.getRawMany();

		const toMap = (rows: { event: string; count: string }[]) => {
			const m: Record<string, number> = {};
			for (const r of rows) m[r.event] = Number(r.count);
			return m;
		};

		const thisWeek = toMap(lastWeekLogs);
		const prevWeek = toMap(prevWeekLogs);

		const totalSent = Number(currentStats?.total_sent ?? 0);
		const totalClicked = Number(currentStats?.total_clicked ?? 0);
		const totalFailed = Number(currentStats?.total_failed ?? 0);
		const clickRate = totalSent > 0 ? Math.round((totalClicked / totalSent) * 10000) / 100 : 0;

		const sentThisWeek = thisWeek["notification.sent"] ?? 0;
		const sentPrevWeek = prevWeek["notification.sent"] ?? 0;
		const failedThisWeek = thisWeek["notification.failed"] ?? 0;
		const failedPrevWeek = prevWeek["notification.failed"] ?? 0;
		const clickedThisWeek = thisWeek["notification.clicked"] ?? 0;
		const clickedPrevWeek = prevWeek["notification.clicked"] ?? 0;

		const sentThisWeekTotal = sentThisWeek;
		const clickRateThisWeek = sentThisWeek > 0 ? Math.round((clickedThisWeek / sentThisWeek) * 10000) / 100 : 0;
		const clickRatePrevWeek = sentPrevWeek > 0 ? Math.round((clickedPrevWeek / sentPrevWeek) * 10000) / 100 : 0;

		return {
			total_sent: totalSent,
			total_request: Number(currentStats?.total_request ?? 0),
			total_clicked: totalClicked,
			total_failed: totalFailed,
			total_closed: Number(currentStats?.total_closed ?? 0),
			total_dropped: Number(currentStats?.total_dropped ?? 0),
			click_rate: clickRate,
			changes: {
				sent: sentThisWeek - sentPrevWeek,
				failed: failedThisWeek - failedPrevWeek,
				click_rate: Math.round((clickRateThisWeek - clickRatePrevWeek) * 100) / 100,
			},
		};
	}
}
export const notificationService = new NotificationService(
	InjectRepository(NotificationEntity),
	InjectRepository(NotificationLogEntity),
);
