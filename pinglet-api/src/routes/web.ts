import { __CONFIG__ } from "@/app/config";
import { SessionHandler } from "@/app/common/Session";
import { HttpException } from "@enjoys/exception";
import { type Request, type Response, Router } from "express";
import fileUpload from "express-fileupload";
import { JwtAuth } from "../middlewares/auth.Middleware";
import ApiRoutes from "./api";
import ProtectedRoutes from "./api/protected.route";
import { AppMiddlewares } from "@/middlewares/app.middleware";

const router = Router();

// Public routes (auth + SDK) — CORS is applied per-route inside ApiRoutes
router.use(`/api/${__CONFIG__.APP.API_VERSION}`, ApiRoutes);

// Protected dashboard routes — uses global CORS (restricted origins + credentials)
const isProduction =
	__CONFIG__.APP.APP_ENV.toUpperCase() === "PRODUCTION" ||
	__CONFIG__.APP.APP_ENV.toUpperCase() === "PROD";

const protectedMiddlewares = [
	...(isProduction ? [AppMiddlewares.isApiProtected()] : []),
	JwtAuth.validateUser,
	SessionHandler.forRoot(),
	fileUpload({ tempFileDir: "./" }),
];

router.use(
	`/api/${__CONFIG__.APP.API_VERSION}`,
	...protectedMiddlewares,
	ProtectedRoutes,
);

router.use("*", (req: Request, res: Response) => {
	throw new HttpException({
		name: "NOT_FOUND",
		message: "Page Not Found",
		stack: {
			info: "Forbidden Resource",
			path: req.baseUrl,
			method: req.method,
		},
	});
});

export default router;
