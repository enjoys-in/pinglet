import { Cors } from "@/app/common/Cors";
import { Limiter } from "@/app/common/Limiter";
import pushNtfyController from "@/handlers/controllers/push-ntfy.controller";
import { ActivityController, UserAuthController } from "@/handlers/controllers/user";
import { JwtAuth } from "@/middlewares/auth.Middleware";
import cors from "cors";
import { Router } from "express";

const router = Router();
const sdkCors = cors(Cors.publicOptions());

// ── Auth routes (use global protected CORS — restricted origins + credentials) ──
router.post("/auth/login", UserAuthController.default.Login);
router.post("/auth/google", UserAuthController.default.GoogleLogin);
router.post("/auth/register", UserAuthController.default.Register);
router.get("/auth/callback", UserAuthController.default.Callback);
router.post("/auth/logout", UserAuthController.default.Logout);
router.post(
	"/auth/forget-password",
	Limiter.forRoute("/auth/forget-password", {
		windowMs: 15 * 60 * 1000,
		max: 5,
		standardHeaders: "draft-7",
		legacyHeaders: false,
	}),
	UserAuthController.default.ForgotPassword,
);
router.post(
	"/auth/reset-password",
	Limiter.forRoute("/auth/reset-password", {
		windowMs: 15 * 60 * 1000,
		max: 10,
		standardHeaders: "draft-7",
		legacyHeaders: false,
	}),
	UserAuthController.default.ResetPassword,
);
router.get("/auth/profile", JwtAuth.Me);

// ── SDK / Public routes (open CORS: origin *, no credentials) ──
router.get("/notifications/load/templates", sdkCors, pushNtfyController.loadTemplates);
router.get("/notifications/load/projects", sdkCors, pushNtfyController.loadConfig);
router.post(
	"/notifications/subscribe",
	sdkCors,
	pushNtfyController.subscribeNotificatons,
);
router.post(
	"/notifications/unsubscribe",
	sdkCors,
	pushNtfyController.unsubscribeNotificatons,
);
router.get("/notifications/sse", sdkCors, pushNtfyController.customNotificatons);
router.get("/notifications/sw.js", sdkCors, pushNtfyController.swJSFile);
router.get("/load-widget-v1/:wid?", sdkCors, pushNtfyController.loadWidgetJsV1File);
router.get("/load-widget-v2/:wid?", sdkCors, pushNtfyController.loadWidgetJsV2File);
router.post("/log/event", sdkCors, pushNtfyController.logEvent);
router.post("/log/track", sdkCors, pushNtfyController.logEvent);
// API to trigger a notification
router.post(
	"/notifications/send",
	sdkCors,
	Limiter.forRoute("/notifications/send", {
		windowMs: 1 * 60 * 1000, // 1 minutes
		max: 30,
		standardHeaders: "draft-7",
		legacyHeaders: false,
	}),
	pushNtfyController.triggerNotification,
);
router.get("/pinglet-sound.mp3", sdkCors, pushNtfyController.sound);

// Public SDK endpoints for activity tracking & session recording
router.post("/track/activity", sdkCors, ActivityController.default.ingestActivity);
router.post("/track/session", sdkCors, ActivityController.default.ingestSession);

// Public notification inbox endpoint (for SDK bell icon widget)
router.get("/inbox", sdkCors, pushNtfyController.getPublicInbox);

export default router;
