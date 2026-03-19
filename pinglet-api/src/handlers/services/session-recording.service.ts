import { SessionRecordingEntity } from "@/factory/entities/session-recording.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Repository } from "typeorm";

class SessionRecordingService {
	constructor(
		private readonly repo: Repository<SessionRecordingEntity>,
	) {}

	async saveRecording(data: Partial<SessionRecordingEntity>) {
		const entity = this.repo.create(data);
		return this.repo.save(entity);
	}

	async getRecordings(projectId: string, limit = 20, offset = 0) {
		return this.repo.find({
			where: { project_id: projectId },
			order: { created_at: "DESC" },
			select: ["id", "project_id", "visitor_id", "duration_ms", "page_url", "user_agent", "event_count", "created_at"],
			take: limit,
			skip: offset,
		});
	}

	async getRecordingById(id: string) {
		return this.repo.findOneBy({ id });
	}

	async getRecordingsByVisitor(projectId: string, visitorId: string) {
		return this.repo.find({
			where: { project_id: projectId, visitor_id: visitorId },
			order: { created_at: "DESC" },
			select: ["id", "project_id", "visitor_id", "duration_ms", "page_url", "event_count", "created_at"],
			take: 20,
		});
	}

	async getRecordingCount(projectId: string) {
		return this.repo.count({ where: { project_id: projectId } });
	}

	async deleteRecording(id: string) {
		return this.repo.delete({ id });
	}
}

export const sessionRecordingService = new SessionRecordingService(
	InjectRepository(SessionRecordingEntity),
);
