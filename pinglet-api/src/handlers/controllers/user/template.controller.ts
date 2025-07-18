import type { Request, Response } from "express";
import { templateService } from "@/handlers/services/template.service";

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
}

export default new TemplateController();
