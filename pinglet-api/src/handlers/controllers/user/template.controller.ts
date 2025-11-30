import type { Request, Response } from "express";
import { templateService } from "@/handlers/services/template.service";
import { Gemini } from "@/handlers/services/ai/gemini-ai.sevice";
import { getMistralCompletion } from "@/handlers/services/ai/mysteral";
import { TemplateCategoryEntity } from "@/factory/entities/template-category.entity";
import { UserEntity } from "@/factory/entities/users.entity";

class TemplateController {

    async getTemplates(req: Request, res: Response) {
        try {
            const websites = await templateService.getAllTemplates();
            res
                .json({
                    message: "All Templates",
                    result: websites,
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
    async createTemplate(req: Request, res: Response) {
        try {
            const result = await getMistralCompletion(JSON.stringify(req.body.raw_text))

            const parsedResult = JSON.parse(result) as { result: string | { function: string }, variables: string[] }
            const category = new TemplateCategoryEntity()
            const userEntity = new UserEntity()
            userEntity.id = req.body.user_id
            category.id = req.body.category_id
            let finalResult = typeof parsedResult.result === "object" && parsedResult.result !== null ? parsedResult.result.function : parsedResult.result;
            const newTemplate = await templateService.createTemplate({
                compiled_text: finalResult,
                raw_text: req.body.raw_text,
                category: category,
                name: req.body.name,
                user: userEntity,
                description: req.body.description,
                parent: req.body?.parent || null,
                variables: parsedResult.variables

            });
            res
                .status(201)
                .json({
                    message: "Template created successfully",
                    result: finalResult,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .status(400)
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .status(500)
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }

    async getTemplateById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const template = await templateService.getTemplateById(+id);
            if (!template) {
                res
                    .status(404)
                    .json({ message: "Template not found", result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Template found",
                    result: template,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .status(400)
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .status(500)
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }

    async updateTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const updatedTemplate = await templateService.updateTemplate(+id, req.body);
            if (!updatedTemplate) {
                res
                    .status(404)
                    .json({ message: "Template not found", result: null, success: false })
                    .end();
                return;
            }
            res
                .json({
                    message: "Template updated successfully",
                    result: updatedTemplate,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .status(400)
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .status(500)
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }

    async deleteTemplate(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const deleted = await templateService.deleteTemplate(+id);
            if (!deleted) {
                res
                    .status(404)
                    .json({ message: "Template not found", result: null, success: false })
                    .end();
                return;
            }
            res
                .status(200)
                .json({
                    message: "Template deleted successfully",
                    result: null,
                    success: true,
                })
                .end();
        } catch (error) {
            if (error instanceof Error) {
                res
                    .status(400)
                    .json({ message: error.message, result: null, success: false })
                    .end();
                return;
            }
            res
                .status(500)
                .json({
                    message: "Something went wrong",
                    result: null,
                    success: false,
                })
                .end();
        }
    }

}

export default new TemplateController();
