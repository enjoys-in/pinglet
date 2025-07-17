import { UserAuthController } from "@/handlers/controllers/user";
import { Router } from "express";

const router = Router();

router.post("/auth/login", UserAuthController.default.Login);
router.get("/auth/callback", UserAuthController.default.Callback);
router.post("/auth/logout", UserAuthController.default.Logout);

export default router;
