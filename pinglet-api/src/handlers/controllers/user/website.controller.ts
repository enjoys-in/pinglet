import type { Request, Response } from "express";
import { websiteService } from "@/handlers/services/website.service";
class WebsiteController {
	async getWebsites(req: Request, res: Response) {
		try {
			const websites = await websiteService.getAllWebsites();
			res
				.json({
					message: "All Websites",
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
	async getWebsite(req: Request, res: Response) {
		try {
			if (!req.params?.id) {
				throw new Error("Invalid Request");
			}
			const website = await websiteService.getWebsiteById(+req.params.id);
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

	async createWebsite(req: Request, res: Response) {
		try {
			const body = req.body;
			const userID = req.user?.id
			const createWebsite = await websiteService.createNewWebsite({
				...body,
				user: {
					id: userID
				}
			});
			res
				.json({
					message: "Website Created",
					result: createWebsite.id,
					success: true,
				})
				.end();
			return
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
	async updateWebsite(req: Request, res: Response) {
		try {

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
	async deleteWebsite(req: Request, res: Response) {
		try {

		} catch (error) {

		}
	}
}

export default new WebsiteController();
