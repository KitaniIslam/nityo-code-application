import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/sqlite";
import { LoginInput, SignupInput } from "../schemas/auth.schema";

// Production-ready environment validation
const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-key-change-in-production";
const SALT_ROUNDS = 12;

// Warn in development if using default secret
if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("JWT_SECRET environment variable is required in production");
}

export interface User {
  id: string;
  email: string;
  fullname: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullname: string;
  };
  token: string;
}

export class AuthService {
  async signup(userData: SignupInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = this.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
      const userId = uuidv4();

      // Insert new user
      const stmt = db.prepare(`
        INSERT INTO users (id, email, fullname, password_hash)
        VALUES (?, ?, ?, ?)
      `);

      const result = stmt.run(
        userId,
        userData.email,
        userData.fullname,
        passwordHash,
      );

      // Check if insertion was successful
      if (!result.changes || result.changes === 0) {
        throw new Error("Failed to create user in database");
      }

      // Retrieve created user
      const user = this.getUserById(userId);
      if (!user) {
        throw new Error("Failed to retrieve created user");
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
        token,
      };
    } catch (error) {
      // Log error for debugging
      console.error("Signup error:", error);
      // Re-throw with more specific message for production
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Signup failed due to an unexpected error");
    }
  }

  async login(credentials: LoginInput): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = this.getUserByEmail(credentials.email);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        credentials.password,
        user.password_hash,
      );
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      // Generate token
      const token = this.generateToken(user);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Login failed due to an unexpected error");
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      // Find user by email
      const user = this.getUserByEmail(email);
      if (!user) {
        throw new Error("User not found");
      }

      // TODO: Implement password reset logic (send email, generate reset token, etc.)
      console.log(`Password reset requested for: ${email}`);

      // For now, just log the request - implement email sending in production
    } catch (error) {
      console.error("Reset password error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Password reset failed due to an unexpected error");
    }
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    try {
      // Find user by ID
      const user = this.getUserById(userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(
        currentPassword,
        user.password_hash,
      );
      if (!isValidPassword) {
        throw new Error("Current password is incorrect");
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

      // Update password in database
      const stmt = db.prepare(`
        UPDATE users 
        SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);

      const result = stmt.run(newPasswordHash, userId);

      // Check if update was successful
      if (!result.changes || result.changes === 0) {
        throw new Error("Failed to update password in database");
      }
    } catch (error) {
      console.error("Update password error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Password update failed due to an unexpected error");
    }
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload & {
        userId: string;
      };
      if (!decoded.userId) {
        throw new Error("Invalid token structure");
      }
      return { userId: decoded.userId };
    } catch (error) {
      console.error("Token verification error:", error);
      throw new Error("Invalid or expired token");
    }
  }

  private getUserByEmail(email: string): User | null {
    try {
      const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
      const result = stmt.get(email) as User | null;
      return result;
    } catch (error) {
      console.error("Database error in getUserByEmail:", error);
      return null;
    }
  }

  private getUserById(id: string): User | null {
    try {
      const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
      const result = stmt.get(id) as User | null;
      return result;
    } catch (error) {
      console.error("Database error in getUserById:", error);
      return null;
    }
  }

  private generateToken(user: User): string {
    try {
      return jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "24h" });
    } catch (error) {
      console.error("Token generation error:", error);
      throw new Error("Failed to generate authentication token");
    }
  }
}
