import { templateCategoryService } from "@/handlers/services/template-category.service";
import type { Request, Response } from "express";
import { IsNull } from "typeorm";

class TemplateCategoryController {
	async getTemplateCategories(req: Request, res: Response) {
		try {
			const websites =
				await templateCategoryService.getAllTemplatesCategoryWithTemplatesCount();
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
	async getTemplatesByCategory(req: Request, res: Response) {
		try {
			const websites =
				await templateCategoryService.getTemplateCategoryWithTemplatesById({
					where: {
						id: +req.params.id,
						user: [{ id: req.user?.id }, { id: IsNull() }],
						templates: {
							parent: IsNull(),
						},
					},
					select: {
						id: true,
						name: true,
						description: true,
						templates: {
							id: true,
							name: true,
							description: true,
							variants: true,
							parent: true,
							compiled_text: true,
							config: true,
							raw_text: true,
							is_active: true,
							is_default: true,
							type: true,
							variables: true,
							user: {
								id: true,
							},
						},
					},
					relations: {
						templates: {
							user: true,
							variants: true,
						},
					},
				});
			res
				.json({
					message: "Templates By Category",
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
