import {
  ApiResponse,
  LoginRequest,
  SignupRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  AuthResponse,
} from "../types/auth";

// API base URL - configure this based on your environment
const API_BASE_URL = "http://localhost:3000/api";

// Custom error class for API errors
class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Generic API request helper
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log("🚀 ~ apiRequest ~ url:", url);

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    console.log("🚀 ~ apiRequest ~ data:", JSON.stringify(data, null, 2));

    if (!response.ok) {
      throw new ApiError(
        data.error || `HTTP error! status: ${response.status}`,
        response.status,
        data,
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors or other exceptions
    throw new ApiError(
      error instanceof Error ? error.message : "Network error occurred",
      undefined,
      error,
    );
  }
};

// Authentication API functions
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<AuthResponse["data"]>("/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Login failed",
      };
    } catch (error) {
      if (error instanceof ApiError) {
        // Map different error types to user-friendly messages
        if (error.status === 401) {
          return {
            success: false,
            error: "Invalid email or password",
          };
        }

        if (error.status === 400) {
          return {
            success: false,
            error: error.data?.error || "Invalid login data",
          };
        }
      }

      return {
        success: false,
        error: "Login failed. Please try again.",
      };
    }
  },

  // Register new user
  signup: async (userData: SignupRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest<AuthResponse["data"]>("/signup", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: "Registration failed",
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          const errorMessage = error.data?.error || "Registration failed";

          // Map specific error messages
          if (
            errorMessage.includes("email") &&
            errorMessage.includes("exists")
          ) {
            return {
              success: false,
              error: "An account with this email already exists",
            };
          }

          return {
            success: false,
            error: errorMessage,
          };
        }
      }

      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  },

  // Reset password
  resetPassword: async (
    email: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      await apiRequest("/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      return {
        success: true,
        message: "Password reset instructions sent to your email",
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          return {
            success: false,
            error: error.data?.error || "Invalid email address",
          };
        }
      }

      return {
        success: false,
        error: "Failed to send reset instructions. Please try again.",
      };
    }
  },

  // Update password
  updatePassword: async (
    token: string,
    passwords: UpdatePasswordRequest,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      await apiRequest("/update-password", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
      });

      return {
        success: true,
        message: "Password updated successfully",
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 400) {
          return {
            success: false,
            error: error.data?.error || "Failed to update password",
          };
        }

        if (error.status === 401) {
          return {
            success: false,
            error: "Session expired. Please login again.",
          };
        }
      }

      return {
        success: false,
        error: "Failed to update password. Please try again.",
      };
    }
  },

  // Get user profile
  getProfile: async (
    token: string,
  ): Promise<{ success: boolean; user?: any; error?: string }> => {
    try {
      const response = await apiRequest<any>("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success) {
        return {
          success: true,
          user: response.data,
        };
      }

      return {
        success: false,
        error: "Failed to load profile",
      };
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          return {
            success: false,
            error: "Session expired. Please login again.",
          };
        }
      }

      return {
        success: false,
        error: "Failed to load profile. Please try again.",
      };
    }
  },
};
