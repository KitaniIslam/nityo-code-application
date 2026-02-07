import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import {
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updatePasswordSchema,
} from "../schemas/auth.schema";
import { AuthService } from "../services/auth.service";

export class AuthController {
  private authService = new AuthService();

  async signup(req: Request, res: Response) {
    try {
      const validationResult = signupSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          data: null,
          success: false,
          error: {
            message: "Validation failed",
            details: validationResult.error.issues,
          },
        });
      }

      const result = await this.authService.signup(validationResult.data);

      res.status(201).json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      res.status(500).json({
        success: false,
        error: message,
        data: null,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const validationResult = loginSchema.safeParse(req.body);
      console.log("🚀 ~ AuthController ~ login ~ req.body:", req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          data: null,
          success: false,
          error: {
            message: "Validation failed",
            details: validationResult.error.issues,
          },
        });
      }

      const result = await this.authService.login(validationResult.data);

      res.json({
        success: true,
        data: result,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      res.status(401).json({ error: message, data: null, success: false });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const validationResult = resetPasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          data: null,
          success: false,
          error: {
            message: "Validation failed",
            details: validationResult.error.issues,
          },
        });
      }

      await this.authService.resetPassword(validationResult.data.email);

      res.json({
        success: true,
        data: { message: "Password reset instructions sent to your email" },
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Password reset failed";
      res.status(400).json({ error: message, data: null, success: false });
    }
  }

  async updatePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: { message: "User not authenticated" },
          data: null,
        });
      }

      const validationResult = updatePasswordSchema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({
          data: null,
          success: false,
          error: {
            message: "Validation failed",
            details: validationResult.error.issues,
          },
        });
      }

      await this.authService.updatePassword(
        req.userId,
        validationResult.data.currentPassword,
        validationResult.data.newPassword,
      );

      res.json({
        success: true,
        data: { message: "Password updated successfully" },
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Password update failed";
      res.status(400).json({ error: message, data: null, success: false });
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({
          success: false,
          error: { message: "User not authenticated" },
          data: null,
        });
      }

      // Get user profile from database
      const user = this.authService.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: "User not found" },
          data: null,
        });
      }

      // Return user profile without sensitive data
      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        error: null,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get profile";
      res.status(500).json({ error: message, data: null, success: false });
    }
  }
}
