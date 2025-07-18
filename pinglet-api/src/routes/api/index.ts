import { UserAuthController } from "@/handlers/controllers/user";
import { JwtAuth } from "@/middlewares/auth.Middleware";
import { Router } from "express";

const router = Router();

router.post("/auth/login", UserAuthController.default.Login);
router.post("/auth/register", UserAuthController.default.Register);
router.get("/auth/callback", UserAuthController.default.Callback);
router.post("/auth/logout", UserAuthController.default.Logout);
router.post("/auth/profile", JwtAuth.Me);

export default router;
