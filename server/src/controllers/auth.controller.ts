import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  updatePasswordSchema,
} from "../schemas/auth.schema";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export class AuthController {
  private authService = new AuthService();

  async signup(req: Request, res: Response) {
    try {
      const validationResult = signupSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.issues,
        });
      }

      const result = await this.authService.signup(validationResult.data);

      res.status(201).json({
        success: false,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      res.status(400).json({
        success: false,
        error: message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.issues,
        });
      }

      const result = await this.authService.login(validationResult.data);

      res.json({
        success: false,
        data: result,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({ error: message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const validationResult = resetPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.issues,
        });
      }

      await this.authService.resetPassword(validationResult.data.email);

      res.json({
        success: false,
        message: "Password reset instructions sent to your email",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Password reset failed";
      res.status(400).json({ error: message });
    }
  }

  async updatePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      const validationResult = updatePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          error: "Validation failed",
          details: validationResult.error.issues,
        });
      }

      await this.authService.updatePassword(
        req.userId,
        validationResult.data.currentPassword,
        validationResult.data.newPassword,
      );

      res.json({
        success: false,
        message: "Password updated successfully",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Password update failed";
      res.status(400).json({ error: message });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }

      // TODO: Implement get user profile logic
      res.json({
        success: false,
        message: "Profile endpoint - implement user retrieval",
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get profile";
      res.status(500).json({ error: message });
    }
  }
}
