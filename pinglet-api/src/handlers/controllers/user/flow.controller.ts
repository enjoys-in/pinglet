import type { Request, Response } from "express";
import { flowService } from "@/handlers/services/flow.service";
import { FlowStatus } from "@/factory/entities/flow.entity";
import { cached, invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation, CacheKeys, CacheTTL } from "@/utils/types/cache";

class FlowController {
	// ─── List all flows ───
	async getAllFlows(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const flows = await cached(
				CacheKeys.userFlows(userId),
				CacheTTL.MEDIUM,
				() => flowService.findAllByUser(userId),
			);
			res.json({ message: "Flows retrieved", result: flows, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Get single flow ───
	async getFlow(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const { id } = req.params;
			const flow = await cached(
				CacheKeys.flow(id),
				CacheTTL.MEDIUM,
				() => flowService.findOne(id, userId),
			);
			if (!flow) {
				res.status(404).json({ message: "Flow not found", result: null, success: false }).end();
				return;
			}
			res.json({ message: "Flow retrieved", result: flow, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Create flow ───
	async createFlow(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const { name, description, projectId, nodes, edges, status } = req.body;

			if (!name || !projectId) {
				res.status(400).json({ message: "name and projectId are required", result: null, success: false }).end();
				return;
			}

			const flow = await flowService.create(userId, {
				name,
				description: description || null,
				project_id: projectId,
				nodes: nodes || [],
				edges: edges || [],
				status: status || FlowStatus.DRAFT,
			});

			await invalidateCache([
				...CacheInvalidation.flow(userId),
				...CacheInvalidation.ntfyProject(projectId),
			]);
			res.status(201).json({ message: "Flow created", result: flow, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Update flow ───
	async updateFlow(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const { id } = req.params;
			const { name, description, nodes, edges, status } = req.body;

			const flow = await flowService.update(id, userId, {
				...(name !== undefined && { name }),
				...(description !== undefined && { description }),
				...(nodes !== undefined && { nodes }),
				...(edges !== undefined && { edges }),
				...(status !== undefined && { status }),
			});

			if (!flow) {
				res.status(404).json({ message: "Flow not found", result: null, success: false }).end();
				return;
			}

			await invalidateCache([
				...CacheInvalidation.flow(userId, id),
				...CacheInvalidation.ntfyProject(flow.project_id),
			]);
			res.json({ message: "Flow updated", result: flow, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Delete flow ───
	async deleteFlow(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const { id } = req.params;
			const flow = await flowService.remove(id, userId);
			if (!flow) {
				res.status(404).json({ message: "Flow not found", result: null, success: false }).end();
				return;
			}
			await invalidateCache([
				...CacheInvalidation.flow(userId, id),
				...CacheInvalidation.ntfyProject(flow.project_id),
			]);
			res.json({ message: "Flow deleted", result: null, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Toggle status (active / paused / draft) ───
	async updateStatus(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const { id } = req.params;
			const { status } = req.body;

			if (!status || !Object.values(FlowStatus).includes(status)) {
				res.status(400).json({
					message: `status must be one of: ${Object.values(FlowStatus).join(", ")}`,
					result: null,
					success: false,
				}).end();
				return;
			}

			const flow = await flowService.updateStatus(id, userId, status);
			if (!flow) {
				res.status(404).json({ message: "Flow not found", result: null, success: false }).end();
				return;
			}

			await invalidateCache([
				...CacheInvalidation.flow(userId, id),
				...CacheInvalidation.ntfyProject(flow.project_id),
			]);
			res.json({ message: `Flow status changed to ${status}`, result: flow, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Dashboard stats ───
	async getStats(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const stats = await cached(
				CacheKeys.userFlowStats(userId),
				CacheTTL.SHORT,
				() => flowService.getStats(userId),
			);
			res.json({ message: "Flow stats", result: stats, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}

	// ─── Execution logs ───
	async getExecutions(req: Request, res: Response) {
		try {
			const userId = req.user?.id as number;
			const { id } = req.params;
			const limit = Math.min(Number(req.query.limit) || 50, 100);
			const offset = Number(req.query.offset) || 0;

			const executions = await flowService.getExecutions(id, userId, limit, offset);
			if (executions === null) {
				res.status(404).json({ message: "Flow not found", result: null, success: false }).end();
				return;
			}
			res.json({ message: "Execution logs", result: executions, success: true }).end();
		} catch (error) {
			res.json({ message: error instanceof Error ? error.message : "Something went wrong", result: null, success: false }).end();
		}
	}
}

export default new FlowController();
