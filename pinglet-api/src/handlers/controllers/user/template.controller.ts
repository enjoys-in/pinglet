import { TemplateCategoryEntity } from "@/factory/entities/template-category.entity";
import { UserEntity } from "@/factory/entities/users.entity";
import { getMistralCompletion } from "@/handlers/services/ai/mysteral";
import { templateService } from "@/handlers/services/template.service";
import { cached, invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation, CacheKeys, CacheTTL } from "@/utils/types/cache";
import type { Request, Response } from "express";

class TemplateController {
	async getTemplates(req: Request, res: Response) {
		try {
			const websites = await cached(
				CacheKeys.templates(),
				CacheTTL.LONG,
				() => templateService.getAllTemplates(),
			);
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
			const result = await getMistralCompletion(
				JSON.stringify(req.body.raw_text),
			);

			const parsedResult = JSON.parse(result) as {
				result: string | { function: string };
				variables: string[];
			};
			const category = new TemplateCategoryEntity();
			const userEntity = new UserEntity();
			userEntity.id = req.user?.id;
			category.id = req.body.category_id;
			const finalResult =
				typeof parsedResult.result === "object" && parsedResult.result !== null
					? parsedResult.result.function
					: parsedResult.result;
			const newTemplate = await templateService.createTemplate({
				compiled_text: finalResult,
				raw_text: req.body.raw_text,
				category: category,
				name: req.body.name,
				user: userEntity,
				description: req.body.description,
				parent: req.body?.parent || null,
				variables: parsedResult.variables,
			});
			await invalidateCache(CacheInvalidation.template(req.user?.id!));
			res
				.status(201)
				.json({
					message: "Template created successfully",
					result: newTemplate.id,
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
			const template = await cached(
				CacheKeys.template(+id),
				CacheTTL.LONG,
				() => templateService.getTemplateByOpts({
				where: { id: +id, user: { id: req.user?.id } },
				select: {
					id: true,
					name: true,
					description: true,
					category: {
						id: true,
						name: true,
						description: true,
						created_at: true,
						updated_at: true,
					},
					user: {
						id: true,
						email: true,
					},
					parent: true,
					variables: true,
					raw_text: true,
					compiled_text: true,
					created_at: true,
					updated_at: true,
				},
				relations: {
					category: true,
					user: true,
				},
			}),
			);
			if (!template) {
				throw new Error("Template not found");
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
			const result = await getMistralCompletion(
				JSON.stringify(req.body.raw_text),
			);

			const parsedResult = JSON.parse(result) as {
				result: string | { function: string };
				variables: string[];
			};
			const category = new TemplateCategoryEntity();
			const userEntity = new UserEntity();
			userEntity.id = req.user?.id;
			category.id = req.body.category_id;
			const finalResult =
				typeof parsedResult.result === "object" && parsedResult.result !== null
					? parsedResult.result.function
					: parsedResult.result;

			const updatedTemplate = await templateService.updateTemplate(+id, {
				name: req.body.name,
				description: req.body.description,
				category: category,
				user: userEntity,
				parent: req.body?.parent || null,
				variables: parsedResult.variables,
				raw_text: req.body.raw_text,
				compiled_text: finalResult,
			});
			if (updatedTemplate.affected === 0) {
				throw new Error("Template not found");
			}
			await invalidateCache(CacheInvalidation.template(req.user?.id!, +id));

			res
				.json({
					message: "Template updated successfully",
					result: updatedTemplate.affected,
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
			await invalidateCache(CacheInvalidation.template(req.user?.id!, +id));
			res
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
