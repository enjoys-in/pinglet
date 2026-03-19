import { UnsubscribeLogEntity } from "@/factory/entities/unsubscribe-log.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Repository } from "typeorm";

class UnsubscribeAnalyticsService {
	constructor(
		private readonly repo: Repository<UnsubscribeLogEntity>,
	) {}

	async logUnsubscribe(data: Partial<UnsubscribeLogEntity>) {
		const entity = this.repo.create(data);
		return this.repo.save(entity);
	}

	async getUnsubscribeLogs(projectId: string, limit = 50, offset = 0) {
		return this.repo.find({
			where: { project_id: projectId },
			order: { created_at: "DESC" },
			take: limit,
			skip: offset,
		});
	}

	async getReasonBreakdown(projectId: string) {
		return this.repo
			.createQueryBuilder("ul")
			.where("ul.project_id = :projectId", { projectId })
			.select("COALESCE(ul.reason, 'not_specified')", "reason")
			.addSelect("COUNT(*)", "count")
			.groupBy("ul.reason")
			.orderBy("count", "DESC")
			.getRawMany();
	}

	async getUnsubscribesByProject(userId: number) {
		return this.repo
			.createQueryBuilder("ul")
			.innerJoin("projects", "p", "p.unique_id = ul.project_id")
			.where("p.user_id = :userId", { userId })
			.select("ul.project_id", "project_id")
			.addSelect("COUNT(*)", "total")
			.addSelect("COALESCE(ul.reason, 'not_specified')", "top_reason")
			.groupBy("ul.project_id")
			.addGroupBy("ul.reason")
			.orderBy("total", "DESC")
			.getRawMany();
	}

	async getTrend(projectId: string, days = 30) {
		const since = new Date();
		since.setDate(since.getDate() - days);
		return this.repo
			.createQueryBuilder("ul")
			.where("ul.project_id = :projectId", { projectId })
			.andWhere("ul.created_at >= :since", { since })
			.select("DATE(ul.created_at)", "date")
			.addSelect("COUNT(*)", "count")
			.groupBy("DATE(ul.created_at)")
			.orderBy("date", "ASC")
			.getRawMany();
	}
}

export const unsubscribeAnalyticsService = new UnsubscribeAnalyticsService(
	InjectRepository(UnsubscribeLogEntity),
);
