/**
 * Node Executors — one handler per FlowNodeType.
 * Each returns { output, nextHandles } telling the engine which edges to follow.
 */
import { FlowNodeType } from "@/factory/entities/flow.entity";
import { QueueService } from "@/utils/services/queue";
import { QUEUE_JOBS } from "@/utils/services/queue/name";

const sendPushQueue = QueueService.createQueue("SEND_BROWSER_NOTIFICATION");
const sendToKafkaQueue = QueueService.createQueue("SEND_KAFKA_NOTIFICATION");

export interface ExecutionContext {
	projectId: string;
	userId?: number;
	triggerPayload: Record<string, any>;
	/** Accumulated data from previous nodes */
	variables: Record<string, any>;
}

export interface NodeResult {
	status: "success" | "error" | "skipped";
	output?: Record<string, any>;
	/** Which sourceHandle(s) to follow. null = follow all outgoing edges */
	nextHandles?: string[] | null;
	/** Set true if the engine should pause (e.g. DELAY node schedules a delayed continuation) */
	pause?: boolean;
	pauseMs?: number;
	error?: string;
}

type NodeExecutor = (
	node: { id: string; type: string; data: Record<string, any> },
	ctx: ExecutionContext,
) => Promise<NodeResult>;

// ─── EVENT_TRIGGER ──────────────────────────────────────────
const executeTrigger: NodeExecutor = async (_node, _ctx) => {
	// Trigger is the entry point — always succeeds, passes through
	return { status: "success", output: { triggered: true } };
};

// ─── CONDITION ──────────────────────────────────────────────
const executeCondition: NodeExecutor = async (node, ctx) => {
	const { field, operator, value } = node.data || {};
	const actual = ctx.triggerPayload[field] ?? ctx.variables[field];

	let result = false;
	switch (operator) {
		case "equals":
		case "==":
			result = String(actual) === String(value);
			break;
		case "not_equals":
		case "!=":
			result = String(actual) !== String(value);
			break;
		case "contains":
			result = String(actual).includes(String(value));
			break;
		case "gt":
		case ">":
			result = Number(actual) > Number(value);
			break;
		case "lt":
		case "<":
			result = Number(actual) < Number(value);
			break;
		case "gte":
		case ">=":
			result = Number(actual) >= Number(value);
			break;
		case "lte":
		case "<=":
			result = Number(actual) <= Number(value);
			break;
		case "exists":
			result = actual !== undefined && actual !== null;
			break;
		default:
			result = !!actual;
	}

	// Follow "true" or "false" handle
	return {
		status: "success",
		output: { condition: result },
		nextHandles: [result ? "true" : "false"],
	};
};

// ─── DELAY ──────────────────────────────────────────────────
const executeDelay: NodeExecutor = async (node, _ctx) => {
	const delayMs = Number(node.data?.delay_ms || node.data?.delay || 0);
	if (delayMs > 0) {
		return {
			status: "success",
			output: { delay_ms: delayMs },
			pause: true,
			pauseMs: delayMs,
		};
	}
	return { status: "success", output: { delay_ms: 0 } };
};

// ─── NOTIFICATION (sends push / SSE notification) ───────────
const executeNotification: NodeExecutor = async (node, ctx) => {
	const data = node.data || {};
	const notifPayload = {
		projectId: ctx.projectId,
		type: data.type || "0",
		title: data.title || "Flow Notification",
		body: data.body || data.description || "",
		data: {
			title: data.title || "Flow Notification",
			body: data.body || data.description || "",
			icon: data.icon || "",
			image: data.image || "",
			url: data.url || "",
			...data.extra,
		},
	};

	// For browser push
	if (notifPayload.type === "-1") {
		await sendPushQueue.add(
			"send-browser-notification",
			JSON.stringify(notifPayload),
			{
				jobId: `flow-${ctx.projectId}-${Date.now()}`,
				removeOnComplete: true,
				removeOnFail: true,
			},
		);
	}

	// Log to Kafka
	await sendToKafkaQueue.add(
		QUEUE_JOBS.SEND_KAFKA_NOTIFICATION,
		{
			project_id: ctx.projectId,
			timestamp: Date.now(),
			type: notifPayload.type,
			event: "sent",
		},
		{
			removeOnComplete: true,
			jobId: `flow-kafka-${ctx.projectId}-${Date.now()}`,
		},
	);

	return { status: "success", output: { notificationSent: true, type: notifPayload.type } };
};

// ─── WEBHOOK (HTTP POST) ────────────────────────────────────
const executeWebhook: NodeExecutor = async (node, ctx) => {
	const { url, method, headers, body: bodyTemplate } = node.data || {};
	if (!url) return { status: "error", error: "Webhook URL not configured" };

	const payload = bodyTemplate
		? JSON.stringify({ ...bodyTemplate, projectId: ctx.projectId, trigger: ctx.triggerPayload })
		: JSON.stringify({ projectId: ctx.projectId, trigger: ctx.triggerPayload, variables: ctx.variables });

	const resp = await fetch(url, {
		method: method || "POST",
		headers: { "Content-Type": "application/json", ...(headers || {}) },
		body: payload,
		signal: AbortSignal.timeout(15000),
	});

	return {
		status: resp.ok ? "success" : "error",
		output: { statusCode: resp.status },
		error: resp.ok ? undefined : `HTTP ${resp.status}`,
	};
};

// ─── AB_SPLIT ───────────────────────────────────────────────
const executeAbSplit: NodeExecutor = async (node, _ctx) => {
	const splits = node.data?.splits || [
		{ handle: "a", weight: 50 },
		{ handle: "b", weight: 50 },
	];
	const rand = Math.random() * 100;
	let cumulative = 0;
	let chosen = splits[0]?.handle || "a";
	for (const s of splits) {
		cumulative += Number(s.weight || 50);
		if (rand <= cumulative) {
			chosen = s.handle;
			break;
		}
	}
	return { status: "success", output: { split: chosen }, nextHandles: [chosen] };
};

// ─── FILTER ─────────────────────────────────────────────────
const executeFilter: NodeExecutor = async (node, ctx) => {
	const { field, operator, value } = node.data || {};
	const actual = ctx.triggerPayload[field] ?? ctx.variables[field];

	let pass = false;
	switch (operator) {
		case "equals": pass = String(actual) === String(value); break;
		case "not_equals": pass = String(actual) !== String(value); break;
		case "contains": pass = String(actual).includes(String(value)); break;
		case "exists": pass = actual !== undefined && actual !== null; break;
		default: pass = !!actual;
	}

	return {
		status: pass ? "success" : "skipped",
		output: { filtered: !pass },
		nextHandles: pass ? null : [], // empty = stop, null = continue all
	};
};

// ─── RATE_LIMIT ─────────────────────────────────────────────
const executeRateLimit: NodeExecutor = async (node, _ctx) => {
	// Rate limit is informational at this stage — the actual limit
	// is enforced at the plan/quota level. Just pass through.
	return { status: "success", output: { rateLimit: node.data?.max || "unlimited" } };
};

// ─── SCHEDULE ───────────────────────────────────────────────
const executeSchedule: NodeExecutor = async (node, _ctx) => {
	// Schedule node defines when a flow can run — the trigger matcher
	// should check this before starting execution. Here we just pass.
	return { status: "success", output: { schedule: node.data?.cron || "immediate" } };
};

// ─── PRESENCE_CHECK ─────────────────────────────────────────
const executePresenceCheck: NodeExecutor = async (node, ctx) => {
	// Check if user/project is currently online via Redis presence key
	const { Cache } = await import("@/utils/services/redis/cacheService");
	const key = `presence:${ctx.projectId}`;
	const count = await Cache.cache.sCard(key).catch(() => 0);
	const isOnline = count > 0;
	return {
		status: "success",
		output: { online: isOnline, count },
		nextHandles: [isOnline ? "online" : "offline"],
	};
};

// ─── TRANSFORM ──────────────────────────────────────────────
const executeTransform: NodeExecutor = async (node, ctx) => {
	const mappings = node.data?.mappings || {};
	// Apply simple key→value mappings to variables
	for (const [key, expr] of Object.entries(mappings)) {
		if (typeof expr === "string" && expr.startsWith("$.")) {
			const path = expr.slice(2);
			ctx.variables[key] = ctx.triggerPayload[path] ?? ctx.variables[path];
		} else {
			ctx.variables[key] = expr;
		}
	}
	return { status: "success", output: { transformed: Object.keys(mappings) } };
};

// ─── EMAIL ──────────────────────────────────────────────────
const executeEmail: NodeExecutor = async (node, _ctx) => {
	const { to, subject, body: emailBody, template } = node.data || {};
	if (!to) return { status: "error", error: "Email recipient not configured" };

	try {
		const { MailService } = await import("@/utils/services/mail/mailService");
		const mailer = MailService.getInstance();
		await mailer.sendEmail({ to, subject: subject || "Pinglet Flow", body: emailBody || "", template });
		return { status: "success", output: { emailSent: true, to } };
	} catch (err: any) {
		return { status: "error", error: err?.message || "Email send failed" };
	}
};

// ─── MERGE / DIVERGE / NOTE — pass-through ──────────────────
const executePassthrough: NodeExecutor = async (_node, _ctx) => {
	return { status: "success", output: {} };
};

// ─── Registry ───────────────────────────────────────────────
export const NODE_EXECUTORS: Record<string, NodeExecutor> = {
	[FlowNodeType.EVENT_TRIGGER]: executeTrigger,
	[FlowNodeType.CONDITION]: executeCondition,
	[FlowNodeType.DELAY]: executeDelay,
	[FlowNodeType.NOTIFICATION]: executeNotification,
	[FlowNodeType.WEBHOOK]: executeWebhook,
	[FlowNodeType.AB_SPLIT]: executeAbSplit,
	[FlowNodeType.FILTER]: executeFilter,
	[FlowNodeType.RATE_LIMIT]: executeRateLimit,
	[FlowNodeType.SCHEDULE]: executeSchedule,
	[FlowNodeType.PRESENCE_CHECK]: executePresenceCheck,
	[FlowNodeType.TRANSFORM]: executeTransform,
	[FlowNodeType.EMAIL]: executeEmail,
	[FlowNodeType.MERGE]: executePassthrough,
	[FlowNodeType.DIVERGE]: executePassthrough,
	[FlowNodeType.NOTE]: executePassthrough,
};
