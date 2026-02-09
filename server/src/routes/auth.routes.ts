import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();
const authController = new AuthController();

// Helper to wrap async handlers
const asyncHandler = (fn: Function) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post(
  "/signup",
  asyncHandler(authController.signup.bind(authController)),
);
router.post("/login", asyncHandler(authController.login.bind(authController)));
router.post(
  "/refresh",
  asyncHandler(authController.refresh.bind(authController)),
);
router.post(
  "/logout",
  asyncHandler(authController.logout.bind(authController)),
);
router.post(
  "/reset-password",
  asyncHandler(authController.resetPassword.bind(authController)),
);
router.put(
  "/update-password",
  authenticateToken,
  asyncHandler(authController.updatePassword.bind(authController)),
);
router.get(
  "/profile",
  authenticateToken,
  asyncHandler(authController.getProfile.bind(authController)),
);
router.post(
  "/logout-all",
  authenticateToken,
  asyncHandler(authController.logoutAll.bind(authController)),
);

export { router as authRoutes };
