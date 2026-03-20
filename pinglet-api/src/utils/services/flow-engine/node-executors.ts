/**
 * Node Executors — one handler per FlowNodeType.
 * Each returns { output, nextHandles } telling the engine which edges to follow.
 * All payloads match the spec in node.txt exactly.
 */
import { FlowNodeType } from "@/factory/entities/flow.entity";
import { Cache } from "@/utils/services/redis/cacheService";
import { MailService } from "@/utils/services/mail/mailService";
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
	/** Tracks per-node arrival count for MERGE nodes */
	mergeCounters: Map<string, number>;
}

export interface NodeResult {
	status: "success" | "error" | "skipped";
	output?: Record<string, any>;
	/** Which sourceHandle(s) to follow. null = follow all outgoing edges */
	nextHandles?: string[] | null;
	/** Set true if the engine should pause (DELAY) */
	pause?: boolean;
	pauseMs?: number;
	error?: string;
}

type NodeExecutor = (
	node: { id: string; type: string; data: Record<string, any> },
	ctx: ExecutionContext,
) => Promise<NodeResult>;

// ─── Helpers ────────────────────────────────────────────────

/** Resolve a dot-path like "payload.amount" against trigger + variables */
function resolvePath(path: string, ctx: ExecutionContext): any {
	const source: Record<string, any> = {
		...ctx.variables,
		payload: ctx.triggerPayload,
		trigger: ctx.triggerPayload,
	};
	const parts = path.split(".");
	let current: any = source;
	for (const p of parts) {
		if (current == null) return undefined;
		current = current[p];
	}
	return current;
}

/** Safely parse a JSON string field — if it's already an object, return as-is */
function safeJsonParse(val: any): any {
	if (typeof val === "object" && val !== null) return val;
	if (typeof val !== "string") return val;
	try { return JSON.parse(val); } catch { return val; }
}

/** Convert duration + unit to milliseconds */
function toMs(duration: number, unit: string): number {
	switch (unit) {
		case "seconds": return duration * 1000;
		case "minutes": return duration * 60_000;
		case "hours":   return duration * 3_600_000;
		case "days":    return duration * 86_400_000;
		default:        return duration * 1000;
	}
}

/** Evaluate a comparison operator */
function evalOperator(actual: any, operator: string, value: any): boolean {
	switch (operator) {
		case "==":
		case "equals":
			return String(actual) === String(value);
		case "!=":
		case "not_equals":
			return String(actual) !== String(value);
		case ">":
		case "gt":
			return Number(actual) > Number(value);
		case "<":
		case "lt":
			return Number(actual) < Number(value);
		case ">=":
		case "gte":
			return Number(actual) >= Number(value);
		case "<=":
		case "lte":
			return Number(actual) <= Number(value);
		case "contains":
			return String(actual).includes(String(value));
		case "not_contains":
			return !String(actual).includes(String(value));
		case "exists":
			return actual !== undefined && actual !== null;
		case "not_exists":
			return actual === undefined || actual === null;
		case "in": {
			const arr = Array.isArray(value) ? value : String(value).split(",").map(s => s.trim());
			return arr.includes(String(actual));
		}
		case "not_in": {
			const arr = Array.isArray(value) ? value : String(value).split(",").map(s => s.trim());
			return !arr.includes(String(actual));
		}
		default:
			return !!actual;
	}
}

// ═══════════════════════════════════════════════════════════════
//  1. EVENT TRIGGER
//  Payload: { label, eventName, description?, payload? }
//  Handles: 0 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeTrigger: NodeExecutor = async (node, ctx) => {
	return {
		status: "success",
		output: {
			triggered: true,
			eventName: node.data?.eventName || node.data?.event,
			label: node.data?.label,
		},
	};
};

// ═══════════════════════════════════════════════════════════════
//  2. CONDITION (If/Else)
//  Payload: { label, field, operator, value, trueLabel?, falseLabel? }
//  Handles: 1 in, 2 out (true / false)
// ═══════════════════════════════════════════════════════════════
const executeCondition: NodeExecutor = async (node, ctx) => {
	const { field, operator, value } = node.data || {};
	const actual = resolvePath(field, ctx);
	const result = evalOperator(actual, operator, value);

	return {
		status: "success",
		output: { condition: result, field, actual, operator, expected: value },
		nextHandles: [result ? "true" : "false"],
	};
};

// ═══════════════════════════════════════════════════════════════
//  3. DELAY
//  Payload: { label, duration, unit }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeDelay: NodeExecutor = async (node, _ctx) => {
	const duration = Number(node.data?.duration || 0);
	const unit = node.data?.unit || "seconds";
	const ms = toMs(duration, unit);

	if (ms > 0) {
		return {
			status: "success",
			output: { delay_ms: ms, duration, unit },
			pause: true,
			pauseMs: ms,
		};
	}
	return { status: "success", output: { delay_ms: 0 } };
};

// ═══════════════════════════════════════════════════════════════
//  4. NOTIFICATION (Send Notification)
//  Payload: { label, notificationType, title, description?,
//             icon?, logo?, url?, variant?,
//             pushIcon?, pushImage?, pushUrl?, requireInteraction?,
//             templateId?, buttons? }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeNotification: NodeExecutor = async (node, ctx) => {
	const d = node.data || {};
	const type = d.notificationType || d.type || "0";

	// Build the notification payload matching what triggerNotification expects
	const notifPayload: Record<string, any> = {
		projectId: ctx.projectId,
		type,
		data: {
			title: d.title || "Flow Notification",
			body: d.description || d.body || "",
			icon: d.icon || d.pushIcon || "",
			image: d.pushImage || d.image || "",
			url: d.url || d.pushUrl || "",
		},
		body: {
			title: d.title || "Flow Notification",
			description: d.description || d.body || "",
			icon: d.icon || "",
			logo: d.logo || "",
			url: d.url || "",
			variant: d.variant,
			templateId: d.templateId,
		},
	};

	// Buttons
	if (Array.isArray(d.buttons) && d.buttons.length > 0) {
		notifPayload.data.actions = d.buttons.map((b: any) => ({
			action: b.action,
			title: b.text,
		}));
		notifPayload.body.buttons = d.buttons;
	}

	// Browser push (type -1) — queue to push worker
	if (type === "-1") {
		if (d.requireInteraction) notifPayload.data.requireInteraction = true;
		await sendPushQueue.add(
			"send-browser-notification",
			JSON.stringify(notifPayload),
			{
				jobId: `flow-push-${ctx.projectId}-${Date.now()}`,
				removeOnComplete: true,
				removeOnFail: true,
			},
		);
	}

	// Log "sent" to Kafka analytics
	await sendToKafkaQueue.add(
		QUEUE_JOBS.SEND_KAFKA_NOTIFICATION,
		{
			project_id: ctx.projectId,
			timestamp: Date.now(),
			type,
			event: "sent",
		},
		{
			removeOnComplete: true,
			jobId: `flow-kafka-${ctx.projectId}-${Date.now()}`,
		},
	);

	return {
		status: "success",
		output: { notificationSent: true, type, title: d.title },
	};
};

// ═══════════════════════════════════════════════════════════════
//  5. WEBHOOK
//  Payload: { label, url, method, headers?, body?, retryCount? }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeWebhook: NodeExecutor = async (node, ctx) => {
	const d = node.data || {};
	if (!d.url) return { status: "error", error: "Webhook URL not configured" };

	const headers = safeJsonParse(d.headers) || {};
	const bodyTemplate = safeJsonParse(d.body);
	const retries = Math.min(Number(d.retryCount || 0), 5);
	const method = (d.method || "POST").toUpperCase();

	const payload = bodyTemplate
		? JSON.stringify({ ...bodyTemplate, projectId: ctx.projectId, trigger: ctx.triggerPayload })
		: JSON.stringify({ projectId: ctx.projectId, trigger: ctx.triggerPayload, variables: ctx.variables });

	let lastError: string | undefined;
	for (let attempt = 0; attempt <= retries; attempt++) {
		try {
			const resp = await fetch(d.url, {
				method,
				headers: { "Content-Type": "application/json", ...headers },
				body: method === "GET" ? undefined : payload,
				signal: AbortSignal.timeout(15000),
			});

			if (resp.ok) {
				return { status: "success", output: { statusCode: resp.status, attempt } };
			}
			lastError = `HTTP ${resp.status}`;
		} catch (err: any) {
			lastError = err?.message || "Fetch failed";
		}
		// Wait before retry (exponential backoff)
		if (attempt < retries) {
			await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
		}
	}

	return { status: "error", output: { attempts: retries + 1 }, error: lastError };
};

// ═══════════════════════════════════════════════════════════════
//  6. A/B SPLIT
//  Payload: { label, splitA, splitB, splitALabel?, splitBLabel? }
//  Handles: 1 in, 2 out (A / B via sourceHandle)
// ═══════════════════════════════════════════════════════════════
const executeAbSplit: NodeExecutor = async (node, _ctx) => {
	const splitA = Number(node.data?.splitA ?? 50);
	const rand = Math.random() * 100;
	const chosen = rand <= splitA ? "a" : "b";

	return {
		status: "success",
		output: { split: chosen, splitA, rand: Math.round(rand) },
		nextHandles: [chosen],
	};
};

// ═══════════════════════════════════════════════════════════════
//  7. FILTER / SEGMENT
//  Payload: { label, field, operator, value, attribute? }
//  Handles: 1 in, 2 out (match / no_match)
// ═══════════════════════════════════════════════════════════════
const executeFilter: NodeExecutor = async (node, ctx) => {
	const { field, operator, value } = node.data || {};
	const actual = resolvePath(field, ctx);
	const pass = evalOperator(actual, operator, value);

	return {
		status: pass ? "success" : "skipped",
		output: { matched: pass, field, actual },
		nextHandles: pass ? ["match"] : ["no_match"],
	};
};

// ═══════════════════════════════════════════════════════════════
//  8. SCHEDULE
//  Payload: { label, days[], startHour, endHour, timezone }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeSchedule: NodeExecutor = async (node, _ctx) => {
	const d = node.data || {};
	const tz = d.timezone || "UTC";
	const days: string[] = d.days || [];
	const startHour = Number(d.startHour ?? 0);
	const endHour = Number(d.endHour ?? 23);

	// Get current time in target timezone
	const now = new Date();
	const formatter = new Intl.DateTimeFormat("en-US", {
		timeZone: tz,
		weekday: "short",
		hour: "numeric",
		hour12: false,
	});
	const parts = formatter.formatToParts(now);
	const weekday = parts.find(p => p.type === "weekday")?.value?.toLowerCase()?.slice(0, 3) || "";
	const hour = Number(parts.find(p => p.type === "hour")?.value ?? 0);

	const dayMatch = days.length === 0 || days.includes(weekday);
	const hourMatch = startHour <= endHour
		? hour >= startHour && hour < endHour
		: hour >= startHour || hour < endHour; // overnight range

	if (dayMatch && hourMatch) {
		return { status: "success", output: { scheduled: true, weekday, hour, tz } };
	}

	return {
		status: "skipped",
		output: { scheduled: false, reason: `Outside schedule: ${weekday} ${hour}:00 ${tz}`, weekday, hour },
		nextHandles: [], // stop — don't follow any edges
	};
};

// ═══════════════════════════════════════════════════════════════
//  9. RATE LIMIT
//  Payload: { label, maxCount, window, windowUnit, key? }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeRateLimit: NodeExecutor = async (node, ctx) => {
	const d = node.data || {};
	const maxCount = Number(d.maxCount || 100);
	const windowMs = toMs(Number(d.window || 60), d.windowUnit || "minutes");
	const windowSec = Math.ceil(windowMs / 1000);
	const groupKey = d.key ? resolvePath(d.key, ctx) : ctx.projectId;

	const redisKey = `flow_rate:${node.id}:${groupKey}`;

	const current = await Cache.cache.incr(redisKey);
	// Set expiry only on first increment
	if (current === 1) {
		await Cache.cache.expire(redisKey, windowSec);
	}

	if (current > maxCount) {
		return {
			status: "skipped",
			output: { rateLimited: true, current, max: maxCount },
			nextHandles: [], // stop
		};
	}

	return {
		status: "success",
		output: { rateLimited: false, current, max: maxCount },
	};
};

// ═══════════════════════════════════════════════════════════════
//  10. PRESENCE CHECK
//  Payload: { label, checkType, fallbackAction? }
//  Handles: 1 in, 2 out (online / offline)
// ═══════════════════════════════════════════════════════════════
const executePresenceCheck: NodeExecutor = async (node, ctx) => {
	const d = node.data || {};
	const checkType = d.checkType || "online";

	const key = `presence:${ctx.projectId}`;
	const count = await Cache.cache.sCard(key).catch(() => 0);
	const isOnline = count > 0;

	const wantedState = checkType === "online" ? isOnline : !isOnline;

	if (wantedState) {
		return {
			status: "success",
			output: { online: isOnline, count, checkType, matched: true },
			nextHandles: [isOnline ? "online" : "offline"],
		};
	}

	// Condition not met — apply fallback
	const fallback = d.fallbackAction || "skip";
	return {
		status: fallback === "skip" ? "skipped" : "success",
		output: { online: isOnline, count, checkType, matched: false, fallback },
		nextHandles: fallback === "skip" ? [] : [isOnline ? "online" : "offline"],
	};
};

// ═══════════════════════════════════════════════════════════════
//  11. TRANSFORM
//  Payload: { label, mappings (JSON string or object) }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeTransform: NodeExecutor = async (node, ctx) => {
	const raw = node.data?.mappings;
	const mappings = safeJsonParse(raw) || {};
	const transformed: string[] = [];

	for (const [key, expr] of Object.entries(mappings)) {
		if (typeof expr === "string") {
			// Resolve dot paths: "payload.price", "trigger.userId", etc.
			ctx.variables[key] = resolvePath(expr, ctx) ?? expr;
		} else {
			ctx.variables[key] = expr;
		}
		transformed.push(key);
	}

	return { status: "success", output: { transformed } };
};

// ═══════════════════════════════════════════════════════════════
//  12. EMAIL
//  Payload: { label, to, subject, body, templateId?, replyTo? }
//  Handles: 1 in, 1 out
// ═══════════════════════════════════════════════════════════════
const executeEmail: NodeExecutor = async (node, ctx) => {
	const d = node.data || {};
	let to = d.to || "";
	// Resolve template variables like {{email}}
	to = to.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) =>
		ctx.triggerPayload[key] ?? ctx.variables[key] ?? "",
	);

	if (!to) return { status: "error", error: "Email recipient not configured" };

	let subject = d.subject || "Pinglet Flow";
	subject = subject.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) =>
		ctx.triggerPayload[key] ?? ctx.variables[key] ?? "",
	);

	let body = d.body || "";
	body = body.replace(/\{\{(\w+)\}\}/g, (_: string, key: string) =>
		ctx.triggerPayload[key] ?? ctx.variables[key] ?? "",
	);

	try {
		const mailer = MailService.getInstance();

		if (d.templateId) {
			await mailer.SendTemplate({
				to,
				subject,
				template: d.templateId,
				context: { ...ctx.triggerPayload, ...ctx.variables },
			});
		} else {
			await mailer.SendMail({
				to,
				subject,
				html: body,
			});
		}

		return { status: "success", output: { emailSent: true, to, subject } };
	} catch (err: any) {
		return { status: "error", error: err?.message || "Email send failed" };
	}
};

// ═══════════════════════════════════════════════════════════════
//  13. MERGE
//  Payload: { label, mergeMode }  — "all" or "any"
//  Handles: N inputs, 1 output
//  The engine tracks arrivals per merge node.
//    "any"  → continue immediately on first arrival
//    "all"  → continue only when all inbound edges have arrived
// ═══════════════════════════════════════════════════════════════
const executeMerge: NodeExecutor = async (node, ctx) => {
	const mode = node.data?.mergeMode || "any";
	return {
		status: "success",
		output: { mergeMode: mode, merged: true },
	};
};

// ═══════════════════════════════════════════════════════════════
//  14. DIVERGE / FORK
//  Payload: { label, outputCount, outputLabels? }
//  Handles: 1 in, N outputs (2-5)
//  All outgoing edges fire in parallel — engine follows all.
// ═══════════════════════════════════════════════════════════════
const executeDiverge: NodeExecutor = async (node, _ctx) => {
	const outputCount = Number(node.data?.outputCount || 2);
	return {
		status: "success",
		output: { diverged: true, outputCount },
		nextHandles: null, // null = follow ALL outgoing edges
	};
};

// ═══════════════════════════════════════════════════════════════
//  15. NOTE
//  Payload: { label, content, color? }
//  Handles: 0 in, 0 out (decorative — engine skips)
// ═══════════════════════════════════════════════════════════════
const executeNote: NodeExecutor = async (_node, _ctx) => {
	return { status: "skipped", output: { note: true } };
};

// ═══════════════════════════════════════════════════════════════
//  Registry
// ═══════════════════════════════════════════════════════════════
export const NODE_EXECUTORS: Record<string, NodeExecutor> = {
	[FlowNodeType.EVENT_TRIGGER]: executeTrigger,
	[FlowNodeType.CONDITION]: executeCondition,
	[FlowNodeType.DELAY]: executeDelay,
	[FlowNodeType.NOTIFICATION]: executeNotification,
	[FlowNodeType.WEBHOOK]: executeWebhook,
	[FlowNodeType.AB_SPLIT]: executeAbSplit,
	[FlowNodeType.FILTER]: executeFilter,
	[FlowNodeType.SCHEDULE]: executeSchedule,
	[FlowNodeType.RATE_LIMIT]: executeRateLimit,
	[FlowNodeType.PRESENCE_CHECK]: executePresenceCheck,
	[FlowNodeType.TRANSFORM]: executeTransform,
	[FlowNodeType.EMAIL]: executeEmail,
	[FlowNodeType.MERGE]: executeMerge,
	[FlowNodeType.DIVERGE]: executeDiverge,
	[FlowNodeType.NOTE]: executeNote,
};
