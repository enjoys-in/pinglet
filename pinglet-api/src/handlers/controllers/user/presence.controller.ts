import type { Request, Response } from "express";
import { livePresenceService } from "@handlers/services/live-presence.service";
import { projectService } from "@handlers/services/project.service";

class PresenceController {
	/**
	 * GET /presence/online?projectId=xxx — get online count for a single project
	 */
	getOnlineCount = async (req: Request, res: Response) => {
		try {
			const projectId = req.query.projectId as string;
			if (!projectId) {
				res.status(400).json({ message: "Missing projectId", success: false });
				return;
			}
			const count = await livePresenceService.getOnlineCount(projectId);
			res.json({ message: "OK", success: true, result: { projectId, online: count } });
		} catch (error) {
			res.json({ message: "Failed to get presence", success: false }).end();
		}
	};

	/**
	 * GET /presence/all — get online counts for all user's projects
	 */
	getAllOnlineCounts = async (req: Request, res: Response) => {
		try {
			const userId = req.user?.id!;
			if (!userId) {
				res.status(401).json({ message: "Unauthorized", success: false });
				return;
			}

			const projects = await projectService.getAllProjects({
				where: { user: { id: userId } },
				select: { unique_id: true, name: true },
			});

			const projectIds = projects.map((p) => p.unique_id);
			const counts = await livePresenceService.getOnlineCounts(projectIds);

			const result = projects.map((p) => ({
				project_id: p.unique_id,
				name: p.name,
				online: counts[p.unique_id] || 0,
			}));

			res.json({ message: "OK", success: true, result });
		} catch (error) {
			res.json({ message: "Failed to get presence", success: false }).end();
		}
	};
}

export default new PresenceController();
