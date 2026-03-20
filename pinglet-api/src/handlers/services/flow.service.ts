import type { Repository } from "typeorm";
import { FlowEntity, FlowNodeType, FlowStatus } from "@/factory/entities/flow.entity";
import { FlowExecutionEntity } from "@/factory/entities/flow-execution.entity";
import { InjectRepository } from "@/factory/typeorm";

class FlowService {
	constructor(
		private readonly flowRepo: Repository<FlowEntity>,
		private readonly execRepo: Repository<FlowExecutionEntity>,
	) {}

	// ─── CRUD ───

	async create(userId: number, data: Partial<FlowEntity>) {
		const flow = this.flowRepo.create({ ...data, user_id: userId });
		return this.flowRepo.save(flow);
	}

	async findAllByUser(userId: number) {
		return this.flowRepo.find({
			where: { user_id: userId },
			order: { updated_at: "DESC" },
		});
	}

	async findOne(id: string, userId: number) {
		return this.flowRepo.findOne({ where: { id, user_id: userId } });
	}

	async update(id: string, userId: number, data: Partial<FlowEntity>) {
		const flow = await this.flowRepo.findOne({ where: { id, user_id: userId } });
		if (!flow) return null;
		Object.assign(flow, data);
		return this.flowRepo.save(flow);
	}

	async remove(id: string, userId: number) {
		const flow = await this.flowRepo.findOne({ where: { id, user_id: userId } });
		if (!flow) return null;
		await this.flowRepo.remove(flow);
		return flow;
	}

	async updateStatus(id: string, userId: number, status: FlowStatus) {
		const flow = await this.flowRepo.findOne({ where: { id, user_id: userId } });
		if (!flow) return null;
		flow.status = status;
		return this.flowRepo.save(flow);
	}

	// ─── Stats (for dashboard) ───

	async getStats(userId: number) {
		const flows = await this.flowRepo.find({ where: { user_id: userId } });

		let totalFlows = flows.length;
		let activeFlows = 0;
		let eventTriggers = 0;
		let notificationActions = 0;

		for (const flow of flows) {
			if (flow.status === FlowStatus.ACTIVE) activeFlows++;

			if (Array.isArray(flow.nodes)) {
				for (const node of flow.nodes) {
					if (node.type === FlowNodeType.EVENT_TRIGGER) eventTriggers++;
					if (node.type === FlowNodeType.NOTIFICATION) notificationActions++;
				}
			}
		}

		return {
			totalFlows,
			activeFlows,
			eventTriggers,
			notificationActions,
		};
	}

	// ─── Execution Logs ───

	async getExecutions(flowId: string, userId: number, limit = 50, offset = 0) {
		// Verify ownership
		const flow = await this.flowRepo.findOne({ where: { id: flowId, user_id: userId } });
		if (!flow) return null;

		return this.execRepo.find({
			where: { flow_id: flowId },
			order: { created_at: "DESC" },
			take: limit,
			skip: offset,
		});
	}
}

export const flowService = new FlowService(
	InjectRepository(FlowEntity),
	InjectRepository(FlowExecutionEntity),
);
