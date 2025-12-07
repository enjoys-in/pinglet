import crypto from "node:crypto";
import type { NextFunction, Request, RequestHandler, Response } from "express";

class AllMiddlewares {
	public customMiddlewareFunction(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		// Your custom middleware logic goes here
		console.log("Custom Middleware executed");
		next();
	}
	logResponseTime(req: Request, res: Response, next: NextFunction) {
		const startHrTime = process.hrtime();
		res.on("finish", () => {
			const elapsedHrTime = process.hrtime(startHrTime);
			const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
			console.log(
				"%s %s %f in %fms",
				req.method,
				req.path,
				req.statusCode,
				elapsedTimeInMs.toFixed(4),
			);
		});
		next();
	}
	public validatePingletWidget(
		req: Request,
		res: Response,
		next: NextFunction,
	) {
		try {
			const projectId = req.header("X-Project-ID");
			const timestamp = req.header("X-Timestamp");
			const signature = req.header("X-Pinglet-Signature");
			const checksum = req.header("X-Pinglet-Checksum");
			const version = req.header("X-Pinglet-Version");
			const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

			if (!projectId || !timestamp || !signature) {
				throw new Error("Missing headers");
			}

			// const secret = getSecretForProject(projectId);
			// if (!secret) {
			//  throw new Error("Invalid project");

			// }

			// const expected = crypto
			// 	.createHmac("sha256", secret)
			// 	.update(projectId + timestamp)
			// 	.digest("hex");

			// if (expected !== signature) {
			// 	throw new Error("Invalid signature");
			// }

			// // Log full fingerprint
			// logToAnalytics({
			// 	projectId,
			// 	ip,
			// 	userAgent: req.headers["user-agent"],
			// 	referrer: req.headers["referer"] || req.headers["origin"],
			// 	checksum,
			// 	version,
			// 	timestamp: Date.now(),
			// 	endpoint: req.originalUrl,
			// 	headers: {
			// 		"x-project-id": projectId,
			// 		"x-checksum": checksum,
			// 		"x-version": version
			// 	},
			// 	payloadSize: JSON.stringify(req.body || {}).length
			// });

			next();
		} catch (error) {
			res.status(500).json({ error: "Internal server error" }).end();
		}
	}
}

export function ApplyMiddleware(
	middlewareFunction: keyof AllMiddlewares,
): RequestHandler {
	const instance = new AllMiddlewares();
	return (req: Request, res: Response, next: NextFunction) =>
		instance[middlewareFunction](req, res, next);
}
