import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

router.post("/signup", authController.signup.bind(authController));
router.post("/login", authController.login.bind(authController));
router.post("/refresh", authController.refresh.bind(authController));
router.post("/logout", authController.logout.bind(authController));
router.post(
  "/reset-password",
  authController.resetPassword.bind(authController),
);
router.put(
  "/update-password",
  authenticateToken,
  authController.updatePassword.bind(authController),
);
router.get(
  "/profile",
  authenticateToken,
  authController.getProfile.bind(authController),
);
router.post(
  "/logout-all",
  authenticateToken,
  authController.logoutAll.bind(authController),
);

export { router as authRoutes };
