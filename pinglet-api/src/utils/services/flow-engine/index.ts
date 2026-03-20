/**
 * Flow Engine — async graph walker.
 * Traverses nodes via edges, executes each node, logs results.
 * Runs entirely in the BullMQ worker process — never blocks the main API.
 */
import { FlowEntity, FlowNodeType, FlowStatus } from "@/factory/entities/flow.entity";
import { FlowExecutionEntity, FlowExecutionStatus } from "@/factory/entities/flow-execution.entity";
import { InjectRepository } from "@/factory/typeorm";
import type { Repository } from "typeorm";
import { NODE_EXECUTORS, type ExecutionContext, type NodeResult } from "./node-executors";
import { QueueService } from "@/utils/services/queue";
import { QUEUE_JOBS, QUEUE_NAME } from "@/utils/services/queue/name";
import { cached } from "@/utils/helpers/cache";
import { CacheKeys, CacheTTL } from "@/utils/types/cache";
import { Logging } from "@/logs";

const flowRepo: Repository<FlowEntity> = InjectRepository(FlowEntity);
const execRepo: Repository<FlowExecutionEntity> = InjectRepository(FlowExecutionEntity);

type FlowNode = FlowEntity["nodes"][number];
type FlowEdge = FlowEntity["edges"][number];

interface ExecuteFlowJobData {
	flowId: string;
	projectId: string;
	userId?: number;
	triggerEvent: string;
	triggerPayload: Record<string, any>;
}

// ─── Find active flows matching a trigger event for a project (cached 5 min) ──
export async function findMatchingFlows(
	projectId: string,
	triggerEvent: string,
): Promise<FlowEntity[]> {
	const flows = await cached(
		CacheKeys.projectActiveFlows(projectId),
		CacheTTL.LONG,
		() => flowRepo.find({
			where: { project_id: projectId, status: FlowStatus.ACTIVE },
		}),
	);

	return flows.filter((flow) => {
		if (!Array.isArray(flow.nodes)) return false;
		return flow.nodes.some(
			(n) => {
				if (n.type !== FlowNodeType.EVENT_TRIGGER) return false;
				const ev = n.data?.eventName || n.data?.event;
				if (!ev) return false;
				if (ev === "*") return true;
				// Normalize: match "clicked" against both "clicked" and "notification.clicked"
				const normalized = ev.replace(/^notification\./, "");
				return normalized === triggerEvent || ev === triggerEvent;
			},
		);
	});
}

// ─── Build adjacency map from edges ─────────────────────────
function buildAdjacency(edges: FlowEdge[]) {
	const adj = new Map<string, Array<{ target: string; sourceHandle?: string | null }>>();
	for (const edge of edges) {
		if (!adj.has(edge.source)) adj.set(edge.source, []);
		adj.get(edge.source)!.push({ target: edge.target, sourceHandle: edge.sourceHandle });
	}
	return adj;
}

// ─── Build reverse adjacency (for MERGE inbound count) ──────
function buildReverseAdjacency(edges: FlowEdge[]) {
	const rev = new Map<string, Set<string>>();
	for (const edge of edges) {
		if (!rev.has(edge.target)) rev.set(edge.target, new Set());
		rev.get(edge.target)!.add(edge.source);
	}
	return rev;
}

// ─── Core execution ─────────────────────────────────────────
export async function executeFlow(data: ExecuteFlowJobData): Promise<void> {
	const startTime = Date.now();

	const flow = await flowRepo.findOne({ where: { id: data.flowId } });
	if (!flow || flow.status !== FlowStatus.ACTIVE) return;

	// Create execution record
	const execution = execRepo.create({
		flow_id: flow.id,
		project_id: data.projectId,
		status: FlowExecutionStatus.RUNNING,
		trigger_event: data.triggerEvent,
		trigger_payload: data.triggerPayload,
		execution_log: [],
		nodes_executed: 0,
		notifications_sent: 0,
	});
	await execRepo.save(execution);

	const ctx: ExecutionContext = {
		projectId: data.projectId,
		userId: data.userId,
		triggerPayload: data.triggerPayload,
		variables: {},
		mergeCounters: new Map(),
	};

	const adj = buildAdjacency(flow.edges || []);
	const revAdj = buildReverseAdjacency(flow.edges || []);
	const nodesMap = new Map<string, FlowNode>();
	for (const n of flow.nodes) nodesMap.set(n.id, n);

	// Find trigger node(s) as starting points
	const triggerNodes = flow.nodes.filter(
		(n) => {
			if (n.type !== FlowNodeType.EVENT_TRIGGER) return false;
			const ev = n.data?.eventName || n.data?.event;
			if (!ev) return false;
			if (ev === "*") return true;
			const normalized = ev.replace(/^notification\./, "");
			return normalized === data.triggerEvent || ev === data.triggerEvent;
		},
	);

	if (triggerNodes.length === 0) {
		execution.status = FlowExecutionStatus.FAILED;
		execution.error_message = "No matching trigger node found";
		execution.duration_ms = Date.now() - startTime;
		execution.completed_at = new Date();
		await execRepo.save(execution);
		return;
	}

	let totalNotifications = 0;
	let totalEmails = 0;
	const visited = new Set<string>(); // prevent infinite loops
	const MAX_NODES = 500; // safety cap

	// BFS walk through the graph
	const queue: Array<{ nodeId: string; delayMs?: number }> = [];
	for (const t of triggerNodes) queue.push({ nodeId: t.id });

	while (queue.length > 0 && execution.nodes_executed < MAX_NODES) {
		const { nodeId, delayMs } = queue.shift()!;

		const node = nodesMap.get(nodeId);
		if (!node) continue;

		// ── MERGE gate: check if all inbound edges have arrived ──
		if (node.type === FlowNodeType.MERGE && node.data?.mergeMode === "all") {
			const inbound = revAdj.get(nodeId)?.size || 1;
			const arrivals = (ctx.mergeCounters.get(nodeId) || 0) + 1;
			ctx.mergeCounters.set(nodeId, arrivals);

			if (arrivals < inbound) continue; // wait for more inputs
		}

		// Skip already-visited (except MERGE nodes which handle their own gating)
		if (node.type !== FlowNodeType.MERGE) {
			if (visited.has(nodeId)) continue;
		}
		visited.add(nodeId);

		// Handle delay: actual wait in worker (non-blocking to API)
		if (delayMs && delayMs > 0) {
			await sleep(Math.min(delayMs, 86_400_000)); // cap at 24h per delay
		}

		const nodeStart = Date.now();
		let result: NodeResult;

		const executor = NODE_EXECUTORS[node.type];
		if (!executor) {
			result = { status: "skipped", output: { reason: `Unknown node type: ${node.type}` } };
		} else {
			try {
				result = await executor(node, ctx);
			} catch (err: any) {
				result = { status: "error", error: err?.message || "Node execution failed" };
			}
		}

		// Log this step
		execution.execution_log.push({
			node_id: node.id,
			node_type: node.type,
			status: result.status,
			started_at: new Date(nodeStart).toISOString(),
			ended_at: new Date().toISOString(),
			error: result.error,
			output: result.output,
		});
		execution.nodes_executed++;

		if (node.type === FlowNodeType.NOTIFICATION && result.status === "success") {
			totalNotifications++;
		}
		if (node.type === FlowNodeType.EMAIL && result.status === "success") {
			totalEmails++;
		}

		// Merge output into variables for downstream nodes
		if (result.output) Object.assign(ctx.variables, result.output);

		// If node errored, stop this branch but continue others
		if (result.status === "error") continue;

		// If note — decorative, no outgoing edges
		if (node.type === FlowNodeType.NOTE) continue;

		// Determine which edges to follow
		const outEdges = adj.get(nodeId) || [];
		const nextHandles = result.nextHandles;

		// DELAY: queue downstream with pauseMs
		if (result.pause && result.pauseMs) {
			for (const edge of outEdges) {
				queue.push({ nodeId: edge.target, delayMs: result.pauseMs });
			}
			continue;
		}

		for (const edge of outEdges) {
			// If nextHandles is null/undefined → follow all edges
			// If nextHandles is [] → follow none (schedule/rate-limit/filter stopped)
			// If nextHandles has values → only follow matching sourceHandle
			if (nextHandles === null || nextHandles === undefined) {
				queue.push({ nodeId: edge.target });
			} else if (nextHandles.length > 0) {
				if (nextHandles.includes(edge.sourceHandle || "")) {
					queue.push({ nodeId: edge.target });
				}
			}
			// nextHandles === [] → don't push anything
		}
	}

	// Finalize execution
	execution.status = execution.execution_log.some((l) => l.status === "error")
		? FlowExecutionStatus.FAILED
		: FlowExecutionStatus.COMPLETED;
	execution.notifications_sent = totalNotifications + totalEmails;
	execution.duration_ms = Date.now() - startTime;
	execution.completed_at = new Date();
	await execRepo.save(execution);

	// Update flow counters
	await flowRepo.increment({ id: flow.id }, "total_executions", 1);
	const totalSent = totalNotifications + totalEmails;
	if (totalSent > 0) {
		await flowRepo.increment({ id: flow.id }, "total_notifications_sent", totalSent);
	}
	if (execution.status === FlowExecutionStatus.FAILED) {
		await flowRepo.increment({ id: flow.id }, "total_errors", 1);
	}
	await flowRepo.update({ id: flow.id }, { last_executed_at: new Date() });
}

// ─── Queue helper: enqueue a flow execution (non-blocking) ──
const executeFlowQueue = QueueService.createQueue("EXECUTE_FLOW");

export function enqueueFlowExecution(data: ExecuteFlowJobData): void {
	executeFlowQueue
		.add(QUEUE_JOBS.EXECUTE_FLOW, data, {
			removeOnComplete: true,
			removeOnFail: 50,
			jobId: `flow-${data.flowId}-${Date.now()}`,
			attempts: 2,
			backoff: { type: "exponential", delay: 3000 },
		})
		.catch((err) => console.error("Failed to enqueue flow execution:", err));
}

// ─── Dispatch: find matching flows and enqueue them all ─────
export async function dispatchFlows(
	projectId: string,
	triggerEvent: string,
	triggerPayload: Record<string, any>,
	userId?: number,
): Promise<void> {
	const flows = await findMatchingFlows(projectId, triggerEvent);
	Logging.dev(`[FlowEngine] dispatchFlows project=${projectId} event=${triggerEvent} matched=${flows.length}`);
	for (const flow of flows) {
		enqueueFlowExecution({
			flowId: flow.id,
			projectId,
			userId,
			triggerEvent,
			triggerPayload,
		});
	}
}

function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
