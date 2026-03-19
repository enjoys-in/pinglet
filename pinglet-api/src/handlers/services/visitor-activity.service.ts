import { VisitorActivityEntity } from "@/factory/entities/visitor-activity.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Repository } from "typeorm";

class VisitorActivityService {
	constructor(
		private readonly repo: Repository<VisitorActivityEntity>,
	) {}

	async trackEvent(data: Partial<VisitorActivityEntity>) {
		const entity = this.repo.create(data);
		return this.repo.save(entity);
	}

	async trackBatch(events: Partial<VisitorActivityEntity>[]) {
		const entities = this.repo.create(events);
		return this.repo.save(entities);
	}

	async getActivityByProject(projectId: string, limit = 50, offset = 0) {
		return this.repo.find({
			where: { project_id: projectId },
			order: { created_at: "DESC" },
			take: limit,
			skip: offset,
		});
	}

	async getActivityByVisitor(projectId: string, visitorId: string) {
		return this.repo.find({
			where: { project_id: projectId, visitor_id: visitorId },
			order: { created_at: "DESC" },
			take: 100,
		});
	}

	async getActivityStats(projectId: string) {
		return this.repo
			.createQueryBuilder("va")
			.where("va.project_id = :projectId", { projectId })
			.select("va.event_type", "event_type")
			.addSelect("COUNT(*)", "count")
			.groupBy("va.event_type")
			.getRawMany();
	}

	async getUniqueVisitors(projectId: string, since: Date) {
		const result = await this.repo
			.createQueryBuilder("va")
			.where("va.project_id = :projectId", { projectId })
			.andWhere("va.created_at >= :since", { since })
			.select("COUNT(DISTINCT va.visitor_id)", "count")
			.getRawOne();
		return Number(result?.count ?? 0);
	}

	async getTopPages(projectId: string, limit = 10) {
		return this.repo
			.createQueryBuilder("va")
			.where("va.project_id = :projectId", { projectId })
			.andWhere("va.event_type = :type", { type: "page_view" })
			.select("va.page_url", "page_url")
			.addSelect("va.page_title", "page_title")
			.addSelect("COUNT(*)", "views")
			.addSelect("COUNT(DISTINCT va.visitor_id)", "unique_visitors")
			.groupBy("va.page_url")
			.addGroupBy("va.page_title")
			.orderBy("views", "DESC")
			.limit(limit)
			.getRawMany();
	}

	async getAvgSessionDuration(projectId: string) {
		const result = await this.repo
			.createQueryBuilder("va")
			.where("va.project_id = :projectId", { projectId })
			.andWhere("va.event_type = :type", { type: "session_end" })
			.andWhere("va.duration_ms > 0")
			.select("AVG(va.duration_ms)", "avg_duration")
			.getRawOne();
		return Number(result?.avg_duration ?? 0);
	}
}

export const visitorActivityService = new VisitorActivityService(
	InjectRepository(VisitorActivityEntity),
);
