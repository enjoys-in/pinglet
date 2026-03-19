import type { Request, Response } from "express";
import { createHash } from "node:crypto";
import { visitorActivityService } from "@handlers/services/visitor-activity.service";
import { sessionRecordingService } from "@handlers/services/session-recording.service";

class ActivityController {
	/**
	 * POST /api/v1/track/activity — public endpoint for SDK to send activity events
	 */
	ingestActivity = async (req: Request, res: Response) => {
		try {
			const { project_id, visitor_id, events } = req.body;
			if (!project_id || !visitor_id || !Array.isArray(events)) {
				res.status(400).json({ message: "Missing project_id, visitor_id, or events", success: false });
				return;
			}

			const ua = req.headers["user-agent"] || "";
			const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
			const ipStr = Array.isArray(ip) ? ip[0] : ip;
			const ipHash = createHash("sha256").update(ipStr).digest("hex").slice(0, 16);

			const records = events.slice(0, 50).map((evt: any) => ({
				project_id,
				visitor_id,
				event_type: evt.event_type || "custom",
				page_url: evt.page_url,
				page_title: evt.page_title,
				referrer: evt.referrer,
				duration_ms: evt.duration_ms || 0,
				metadata: evt.metadata,
				user_agent: ua,
				ip_hash: ipHash,
			}));

			await visitorActivityService.trackBatch(records);
			res.json({ message: "OK", success: true }).end();
		} catch (error) {
			res.json({ message: "Failed to track activity", success: false }).end();
		}
	};

	/**
	 * POST /api/v1/track/session — public endpoint for SDK to save session recordings
	 */
	ingestSession = async (req: Request, res: Response) => {
		try {
			const { project_id, visitor_id, events, page_url, duration_ms } = req.body;
			if (!project_id || !visitor_id || !Array.isArray(events)) {
				res.status(400).json({ message: "Missing required fields", success: false });
				return;
			}

			await sessionRecordingService.saveRecording({
				project_id,
				visitor_id,
				events: events.slice(0, 5000), // cap at 5000 rrweb events
				duration_ms: duration_ms || 0,
				page_url,
				user_agent: req.headers["user-agent"] || "",
				event_count: events.length,
			});
			res.json({ message: "OK", success: true }).end();
		} catch (error) {
			res.json({ message: "Failed to save session", success: false }).end();
		}
	};

	/**
	 * GET /activity/stats?projectId=xxx — protected, get activity stats
	 */
	getActivityStats = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}

			const [stats, topPages, avgDuration, uniqueVisitors] = await Promise.all([
				visitorActivityService.getActivityStats(projectId),
				visitorActivityService.getTopPages(projectId),
				visitorActivityService.getAvgSessionDuration(projectId),
				visitorActivityService.getUniqueVisitors(projectId, new Date(Date.now() - 7 * 86400_000)),
			]);

			res.json({
				message: "OK",
				success: true,
				result: { stats, topPages, avgDuration, uniqueVisitors },
			});
		} catch (error) {
			res.json({ message: "Failed to get stats", success: false }).end();
		}
	};

	/**
	 * GET /activity/events?projectId=xxx&limit=50&offset=0
	 */
	getActivityEvents = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const limit = Math.min(Number(req.query.limit) || 50, 100);
			const offset = Number(req.query.offset) || 0;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}

			const events = await visitorActivityService.getActivityByProject(projectId, limit, offset);
			res.json({ message: "OK", success: true, result: events });
		} catch (error) {
			res.json({ message: "Failed to get events", success: false }).end();
		}
	};

	/**
	 * GET /activity/visitor?projectId=xxx&visitorId=yyy
	 */
	getVisitorActivity = async (req: Request, res: Response) => {
		try {
			const { projectId, visitorId } = req.query as { projectId: string; visitorId: string };
			if (!projectId || !visitorId) {
				res.status(400).json({ message: "Missing projectId or visitorId", success: false });
				return;
			}

			const events = await visitorActivityService.getActivityByVisitor(projectId, visitorId);
			res.json({ message: "OK", success: true, result: events });
		} catch (error) {
			res.json({ message: "Failed to get visitor activity", success: false }).end();
		}
	};

	/**
	 * GET /sessions?projectId=xxx
	 */
	getSessionRecordings = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			const limit = Math.min(Number(req.query.limit) || 20, 50);
			const offset = Number(req.query.offset) || 0;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}

			const [recordings, count] = await Promise.all([
				sessionRecordingService.getRecordings(projectId, limit, offset),
				sessionRecordingService.getRecordingCount(projectId),
			]);
			res.json({ message: "OK", success: true, result: { recordings, total: count } });
		} catch (error) {
			res.json({ message: "Failed to get recordings", success: false }).end();
		}
	};

	/**
	 * GET /sessions/:id — get full session recording for replay
	 */
	getSessionRecording = async (req: Request, res: Response) => {
		try {
			const recording = await sessionRecordingService.getRecordingById(req.params.id);
			if (!recording) {
				res.status(404).json({ message: "Recording not found", success: false });
				return;
			}
			res.json({ message: "OK", success: true, result: recording });
		} catch (error) {
			res.json({ message: "Failed to get recording", success: false }).end();
		}
	};

	/**
	 * DELETE /sessions/:id — delete a session recording
	 */
	deleteSessionRecording = async (req: Request, res: Response) => {
		try {
			await sessionRecordingService.deleteRecording(req.params.id);
			res.json({ message: "OK", success: true });
		} catch (error) {
			res.json({ message: "Failed to delete recording", success: false }).end();
		}
	};
}

export default new ActivityController();
