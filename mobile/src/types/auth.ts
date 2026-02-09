// Authentication types - re-export from central types for backward compatibility
export type {
  User,
  AuthTokens,
  AuthState,
  AuthResponse,
  RefreshTokenResponse,
  ProfileResponse,
  LoginRequest,
  SignupRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  RefreshTokenRequest,
} from "./index";

export interface ApiError {
  success: false;
  error: string;
}

// API response wrapper
export type ApiResponse<T = any> =
  | { success: true; data: T }
  | { success: false; error: string };
