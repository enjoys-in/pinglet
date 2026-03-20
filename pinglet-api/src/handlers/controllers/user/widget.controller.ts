import { WidgetService } from "@/handlers/services/widget.service";
import { cached, invalidateCache } from "@/utils/helpers/cache";
import { CacheInvalidation, CacheKeys, CacheTTL } from "@/utils/types/cache";
import type { Request, Response } from "express";

class WidgetController {
	async getWidgets(req: Request, res: Response) {
		try {
			const userId = req.user?.id;
			const Widgets = await cached(
				CacheKeys.userWidgets(userId!),
				CacheTTL.LONG,
				() => WidgetService.getAllWidgets({
				where: { user: { id: req.user?.id } },
				select: [
					"id",
					"widget_id",
					"style_props",
					"config",
					"is_active",
					"created_at",
					"updated_at",
				],
				order: { created_at: "DESC" },
				}),
			);
			res
				.json({
					message: "All Widgets",
					result: Widgets,
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
	async getWidget(req: Request, res: Response) {
		try {
			if (!req.params?.id) {
				throw new Error("Invalid Widget ID");
			}
			const Widget = await WidgetService.getWidgetByWidgetId(req.params.id);
			res
				.json({
					message: "OK",
					result: Widget,
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

	async createWidget(req: Request, res: Response) {
		try {
			const body = req.body;
			const userID = req.user?.id;
			const createWidget = await WidgetService.createNewWidget({
				data: body,
				user: {
					id: userID,
				},
			});
			await invalidateCache(CacheInvalidation.widget(userID!));
			res
				.json({
					message: "Widget  Created",
					result: createWidget.id,
					success: true,
				})
				.end();
			return;
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
		async updateWidget(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			const body = req.body;
			const website = await WidgetService.updateWidget(id, body);
			if (!website) {
				throw new Error(" Widget not found");
			}
			const userId = req.user?.id;
			await invalidateCache(CacheInvalidation.widget(userId!, id));
			// if (body?.favicon) {
			// 	await websiteService.updateFavicon(id, body.favicon);
			// }
			// if (body?.logo) {
			// 	await websiteService.updateLogo(id, body.logo);
			// }
			res
				.json({
					message: "Widget Updated",
					result: website,
					success: true,
				})
				.end();
			return;
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
		async deleteWidget(req: Request, res: Response) {
		try {
			const id = +req.params.id;
			await WidgetService.deleteWidget(id);
			const userId = req.user?.id;
			await invalidateCache(CacheInvalidation.widget(userId!, id));
			res
				.json({
					message: "Widget Deleted",
					result: null,
					success: true,
				})
				.end();
			return;
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

export default new WidgetController();
