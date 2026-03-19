import { NotificationInboxEntity } from "@/factory/entities/notification-inbox.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Repository } from "typeorm";

class NotificationInboxService {
	constructor(
		private readonly repo: Repository<NotificationInboxEntity>,
	) {}

	async addToInbox(data: Partial<NotificationInboxEntity>) {
		const entity = this.repo.create(data);
		return this.repo.save(entity);
	}

	async getInbox(projectId: string, subscriberId?: number, limit = 30, offset = 0) {
		const where: any = { project_id: projectId };
		if (subscriberId) where.subscriber_id = subscriberId;
		return this.repo.find({
			where,
			order: { created_at: "DESC" },
			take: limit,
			skip: offset,
		});
	}

	async markAsRead(id: string) {
		return this.repo.update({ id }, { is_read: true });
	}

	async markAllAsRead(projectId: string, subscriberId?: number) {
		const where: any = { project_id: projectId, is_read: false };
		if (subscriberId) where.subscriber_id = subscriberId;
		return this.repo.update(where, { is_read: true });
	}

	async getUnreadCount(projectId: string, subscriberId?: number) {
		const where: any = { project_id: projectId, is_read: false };
		if (subscriberId) where.subscriber_id = subscriberId;
		return this.repo.count({ where });
	}

	async deleteFromInbox(id: string) {
		return this.repo.softDelete({ id });
	}
}

export const notificationInboxService = new NotificationInboxService(
	InjectRepository(NotificationInboxEntity),
);
