import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../db/sqlite';
import { LoginInput, SignupInput } from '../schemas/auth.schema';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 12;

export interface User {
  id: string;
  email: string;
  fullname: string;
  birthday: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    fullname: string;
    birthday: string;
  };
  token: string;
}

export class AuthService {
  async signup(userData: SignupInput): Promise<AuthResponse> {
    const existingUser = this.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const passwordHash = await bcrypt.hash(userData.password, SALT_ROUNDS);
    const userId = uuidv4();

    const stmt = db.prepare(`
      INSERT INTO users (id, email, fullname, birthday, password_hash)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(userId, userData.email, userData.fullname, userData.birthday, passwordHash);

    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('Failed to create user');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        birthday: user.birthday,
      },
      token,
    };
  }

  async login(credentials: LoginInput): Promise<AuthResponse> {
    const user = this.getUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        birthday: user.birthday,
      },
      token,
    };
  }

  async resetPassword(email: string): Promise<void> {
    const user = this.getUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }

    // TODO: Implement password reset logic (send email, generate reset token, etc.)
    console.log(`Password reset requested for: ${email}`);
  }

  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    const stmt = db.prepare(`
      UPDATE users 
      SET password_hash = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `);

    stmt.run(newPasswordHash, userId);
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private getUserByEmail(email: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as User | null;
  }

  private getUserById(id: string): User | null {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id) as User | null;
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}
