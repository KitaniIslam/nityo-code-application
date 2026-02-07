// Authentication// User interface for authentication

export interface User {
  id: string;
  email: string;
  fullname: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}

// API request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  fullname: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiError {
  success: false;
  error: string;
}

// API response wrapper
export type ApiResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: string };
