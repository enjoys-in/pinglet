import { planService } from "@/handlers/services/plan.service";
import { projectService } from "@/handlers/services/project.service";
import { cached, invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation, CacheKeys, CacheTTL } from "@/utils/types/cache";
import type { Request, Response } from "express";

class ProjectController {
	async getAllProjects(req: Request, res: Response) {
		try {
			const userId = req.user?.id;

			const projects = await cached(
				CacheKeys.userProjects(userId!),
				CacheTTL.SHORT,
				() => projectService.getAllProjectWithSubsAndNotificationCount(userId),
			);
			res
				.json({
					message: "All Projects",
					result: projects,
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async getProject(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			const project = await cached(
				CacheKeys.project(id),
				CacheTTL.MEDIUM,
				() => projectService.getProjectById(id),
			);
			res
				.json({
					message: "Project Details",
					result: project,
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async createNewProject(req: Request, res: Response) {
		try {
			const body = req.body;
			const userId = req.user?.id;
			const project = await projectService.createNewProject({
				...body,
				user: {
					id: userId,
				},
			});
			await invalidateCache(CacheInvalidation.project(userId!));
			res
				.json({
					message: "Project Created",
					result: {
						id: project.id,
					},
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async deleteProject(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			await projectService.deleteProject(id);
			const userId = req.user?.id;
			await invalidateCache(CacheInvalidation.project(userId!, id));
			res
				.json({
					message: "Project Deleted",
					result: null,
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
	async updateProject(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			const body = req.body;
			const userId = req.user?.id;

			// White-label gate: prevent non-Enterprise users from hiding/replacing branding
			if (body.config?.branding && userId) {
				const brandingChanged = body.config.branding.show === false || body.config.branding.html;
				if (brandingChanged) {
					const hasWhiteLabel = await planService.hasFeature(userId, "white_label");
					if (!hasWhiteLabel) {
						res.status(403).json({
							message: "White-label branding customization requires an Enterprise plan",
							result: null,
							success: false,
						}).end();
						return;
					}
				}
			}

			await projectService.updateProject(id, {
				...body,
				user: {
					id: userId,
				},
			});
			await invalidateCache(CacheInvalidation.project(userId!, id));
			res
				.json({
					message: "Project Updated",
					result: {
						id,
					},
					success: true,
				})
				.end();
		} catch (error) {
			if (error instanceof Error) {
				res
					.json({ message: error.message, result: null, success: false })
					.end();
				return;
			}
			res
				.json({
					message: "Something went wrong",
					result: null,
					success: false,
				})
				.end();
		}
	}
}

export default new ProjectController();
