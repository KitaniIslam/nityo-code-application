import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getDatabase } from "../db/sqlite";
import { LoginInput, SignupInput } from "../schemas/auth.schema";

// Production-ready environment validation
const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-key-change-in-production";
const SALT_ROUNDS = 12;
const ACCESS_TOKEN_EXPIRES_IN = "15m"; // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d"; // 7 days

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
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  // Generate access token (short-lived)
  private generateAccessToken(user: User): string {
    try {
      return jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
      });
    } catch (error) {
      console.error("Failed to generate access token:", error);
      throw new Error("Failed to generate access token");
    }
  }

  // Generate refresh token (long-lived)
  private generateRefreshToken(): string {
    try {
      return jwt.sign({ type: "refresh" }, JWT_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      });
    } catch (error) {
      console.error("Failed to generate refresh token:", error);
      throw new Error("Failed to generate refresh token");
    }
  }

  // Store refresh token in database (hashed)
  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    try {
      const tokenId = uuidv4();
      const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      const stmt = getDatabase().prepare(`
        INSERT INTO refresh_tokens (id, user_id, token_hash, expires_at)
        VALUES (?, ?, ?, ?)
      `);

      const result = stmt.run(
        tokenId,
        userId,
        tokenHash,
        expiresAt.toISOString(),
      );

      if (!result.changes || result.changes === 0) {
        throw new Error("Failed to store refresh token");
      }
    } catch (error) {
      console.error("Failed to store refresh token:", error);
      throw new Error("Failed to store refresh token");
    }
  }

  // Validate refresh token
  private async validateRefreshToken(
    refreshToken: string,
  ): Promise<{ userId: string; tokenId: string } | null> {
    try {
      // First verify JWT signature and type
      const decoded = jwt.verify(refreshToken, JWT_SECRET) as jwt.JwtPayload & {
        type: string;
      };
      if (decoded.type !== "refresh") {
        return null;
      }

      // Find token in database
      const stmt = getDatabase().prepare(`
        SELECT id, user_id, token_hash, expires_at, revoked_at
        FROM refresh_tokens
        WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > datetime('now')
      `);

      // Hash the provided token to compare with stored hash
      const allTokens = getDatabase()
        .prepare(
          `
        SELECT id, user_id, token_hash, expires_at, revoked_at
        FROM refresh_tokens
        WHERE revoked_at IS NULL AND expires_at > datetime('now')
      `,
        )
        .all() as Array<{
        id: string;
        user_id: string;
        token_hash: string;
        expires_at: string;
        revoked_at: string | null;
      }>;

      // Find matching token by comparing hashes
      let matchingToken = null;
      for (const token of allTokens) {
        const isValid = await bcrypt.compare(refreshToken, token.token_hash);
        if (isValid) {
          matchingToken = token;
          break;
        }
      }

      if (!matchingToken) {
        return null;
      }

      return {
        userId: matchingToken.user_id,
        tokenId: matchingToken.id,
      };
    } catch (error) {
      console.error("Failed to validate refresh token:", error);
      return null;
    }
  }

  // Revoke refresh token
  private async revokeRefreshToken(tokenId: string): Promise<void> {
    try {
      const stmt = getDatabase().prepare(`
        UPDATE refresh_tokens 
        SET revoked_at = datetime('now')
        WHERE id = ?
      `);

      const result = stmt.run(tokenId);

      if (!result.changes || result.changes === 0) {
        throw new Error("Failed to revoke refresh token");
      }
    } catch (error) {
      console.error("Failed to revoke refresh token:", error);
      throw new Error("Failed to revoke refresh token");
    }
  }

  // Revoke all refresh tokens for a user
  private async revokeAllUserRefreshTokens(userId: string): Promise<void> {
    try {
      const stmt = getDatabase().prepare(`
        UPDATE refresh_tokens 
        SET revoked_at = datetime('now')
        WHERE user_id = ? AND revoked_at IS NULL
      `);

      stmt.run(userId);
    } catch (error) {
      console.error("Failed to revoke all user refresh tokens:", error);
      throw new Error("Failed to revoke all user refresh tokens");
    }
  }
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
      const stmt = getDatabase().prepare(`
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

      // Generate both tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken();

      // Store refresh token in database
      await this.storeRefreshToken(userId, refreshToken);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
        accessToken,
        refreshToken,
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

      // Generate both tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken();

      // Store refresh token in database
      await this.storeRefreshToken(user.id, refreshToken);

      return {
        user: {
          id: user.id,
          email: user.email,
          fullname: user.fullname,
        },
        accessToken,
        refreshToken,
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
      const stmt = getDatabase().prepare(`
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
      const stmt = getDatabase().prepare("SELECT * FROM users WHERE email = ?");
      const result = stmt.get(email) as User | null;
      return result;
    } catch (error) {
      console.error("Database error in getUserByEmail:", error);
      return null;
    }
  }

  public getUserById(id: string): User | null {
    try {
      const stmt = getDatabase().prepare("SELECT * FROM users WHERE id = ?");
      const result = stmt.get(id) as User | null;
      return result;
    } catch (error) {
      console.error("Database error in getUserById:", error);
      return null;
    }
  }

  // Refresh access token using refresh token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      // Validate refresh token
      const tokenData = await this.validateRefreshToken(refreshToken);
      if (!tokenData) {
        throw new Error("Invalid or expired refresh token");
      }

      // Get user
      const user = this.getUserById(tokenData.userId);
      if (!user) {
        throw new Error("User not found");
      }

      // Generate new tokens
      const newAccessToken = this.generateAccessToken(user);
      const newRefreshToken = this.generateRefreshToken();

      // Revoke old refresh token
      await this.revokeRefreshToken(tokenData.tokenId);

      // Store new refresh token
      await this.storeRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.error("Token refresh error:", error);
      if (error instanceof Error) {
        throw new Error(error.message);
      }
      throw new Error("Token refresh failed due to an unexpected error");
    }
  }

  // Logout user (revoke refresh token)
  async logout(refreshToken: string): Promise<void> {
    try {
      const tokenData = await this.validateRefreshToken(refreshToken);
      if (tokenData) {
        await this.revokeRefreshToken(tokenData.tokenId);
      }
    } catch (error) {
      console.error("Logout error:", error);
      throw new Error("Logout failed");
    }
  }

  // Logout from all devices (revoke all refresh tokens)
  async logoutAllDevices(userId: string): Promise<void> {
    try {
      await this.revokeAllUserRefreshTokens(userId);
    } catch (error) {
      console.error("Logout all devices error:", error);
      throw new Error("Logout from all devices failed");
    }
  }
}
