import { Limiter } from "@/app/common/Limiter";
import pushNtfyController from "@/handlers/controllers/push-ntfy.controller";
import { UserAuthController } from "@/handlers/controllers/user";
import { JwtAuth } from "@/middlewares/auth.Middleware";
import { Router } from "express";



const router = Router();

router.post("/auth/login", UserAuthController.default.Login);
router.post("/auth/register", UserAuthController.default.Register);
router.get("/auth/callback", UserAuthController.default.Callback);
router.post("/auth/logout", UserAuthController.default.Logout);
router.post("/auth/profile", JwtAuth.Me);
// SSE endpoint
router.get("/notifications/load/templates", pushNtfyController.loadTemplates);
router.get("/notifications/load/projects", pushNtfyController.loadConfig);
router.get("/notifications/subscribe", pushNtfyController.subscribeNotificatons);
router.get("/notifications/sse", pushNtfyController.pushNotificatons);
// API to trigger a notification
router.post("/notifications/send", Limiter.forRoute("/notifications/subscribe", {
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 30,
    standardHeaders: "draft-7",
    legacyHeaders: false,
}),  pushNtfyController.triggerNotification);
router.get("/notification-sound", pushNtfyController.sound);
export default router;
