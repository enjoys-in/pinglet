import { projectService } from "@/handlers/services/project.service";
import type { Request, Response } from "express";

class ProjectController {
    async getAllProjects(req: Request, res: Response) {
        try {
            const userId = req.user!.id
            const website = await projectService.getAllProjects({
                relations: {
                    website: true,
                    category: true,
                },
                where: { user: { id: userId } },
                select: {
                    website: {
                        id: true,
                        domain: true,
                    },
                    category: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }

            });
            res
                .json({
                    message: "Logged In",
                    result: website,
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
            const project = await projectService.getProjectById(id);
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
            const userId = req.user!.id
            const project = await projectService.createNewProject({
                ...body,
                user: {
                    id: userId
                }
            });
            res
                .json({
                    message: "Project Created",
                    result: {
                        id: project.id
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
            const userId = req.user!.id
            await projectService.updateProject(id, {
                ...body,
                user: {
                    id: userId
                }
            });
            res
                .json({
                    message: "Project Updated",
                    result: {
                        id
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
