import { __CONFIG__ } from "@/app/config";
import { SessionHandler } from "@/app/common/Session";
import { HttpException } from "@enjoys/exception";
import { type Request, type Response, Router } from "express";
import fileUpload from "express-fileupload";
import { JwtAuth } from "../middlewares/auth.Middleware";
import ApiRoutes from "./api";
import ProtectedRoutes from "./api/protected.route";

const router = Router();

// Public routes (auth + SDK) — CORS is applied per-route inside ApiRoutes
router.use(`/api/${__CONFIG__.APP.API_VERSION}`, ApiRoutes);

// Protected dashboard routes — uses global CORS (restricted origins + credentials)
router.use(
	`/api/${__CONFIG__.APP.API_VERSION}`,
	JwtAuth.validateUser,
	SessionHandler.forRoot(),
	fileUpload({ tempFileDir: "./" }),
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
