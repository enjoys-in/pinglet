import { templateCategoryService } from "@/handlers/services/template-category.service";
import type { Request, Response } from "express";

class TemplateCategoryController {

    async getTemplateCategories(req: Request, res: Response) {
        try {
            const websites = await templateCategoryService.getAllTemplatesCategoryWithTemplatesCount();
            res
                .json({
                    message: "All Templates Categories",
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

export default new TemplateCategoryController();
