import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { authApi } from "../api/auth.api";
import { User } from "../types/auth";
import { clearSession, loadSession, saveSession } from "../utils/secureStore";

// Auth context type definitions
export interface AuthContextType {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (
    fullname: string,
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (
    email: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  updatePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message?: string; error?: string }>;
  refreshTokens: () => Promise<{ success: boolean; error?: string }>;
  restoreSession: () => Promise<void>;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed state
  const isAuthenticated = !!user && !!accessToken && !!refreshToken;

  // Mutex to prevent concurrent refresh attempts
  const refreshMutex = useRef(false);

  // Restore session on app startup
  const restoreSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const session = await loadSession();

      if (session) {
        setUser(session.user);
        setAccessToken(session.accessToken);
        setRefreshToken(session.refreshToken);
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      // Clear corrupted session
      await clearSession();
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh tokens function
  const refreshTokens = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    // Prevent concurrent refresh attempts
    if (refreshMutex.current) {
      return { success: false, error: "Refresh already in progress" };
    }

    if (!refreshToken) {
      return { success: false, error: "No refresh token available" };
    }

    try {
      refreshMutex.current = true;

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      const data = await response.json();

      if (data.success && data.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          data.data;

        // Update state
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        // Update secure storage
        if (user) {
          await saveSession({
            user,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }

        return { success: true };
      } else {
        return { success: false, error: data.error || "Token refresh failed" };
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return { success: false, error: "Token refresh failed" };
    } finally {
      refreshMutex.current = false;
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.login({ email, password });

      if (response.success && response.data) {
        const {
          user: userData,
          accessToken: userAccessToken,
          refreshToken: userRefreshToken,
        } = response.data;

        // Save session to secure storage
        const sessionSaved = await saveSession({
          user: userData,
          accessToken: userAccessToken,
          refreshToken: userRefreshToken,
        });

        if (sessionSaved) {
          // Update state
          setUser(userData);
          setAccessToken(userAccessToken);
          setRefreshToken(userRefreshToken);

          return { success: true };
        } else {
          return { success: false, error: "Failed to save session" };
        }
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  // Signup function
  const signup = async (
    fullname: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await authApi.signup({
        fullname,
        email,
        password,
      });

      if (response.success && response.data) {
        const {
          user: userData,
          accessToken: userAccessToken,
          refreshToken: userRefreshToken,
        } = response.data;

        // Save session to secure storage
        const sessionSaved = await saveSession({
          user: userData,
          accessToken: userAccessToken,
          refreshToken: userRefreshToken,
        });

        if (sessionSaved) {
          // Update state
          setUser(userData);
          setAccessToken(userAccessToken);
          setRefreshToken(userRefreshToken);

          return { success: true };
        } else {
          return { success: false, error: "Failed to save session" };
        }
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error("Signup error:", err);
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout endpoint if we have a refresh token
      if (refreshToken) {
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/logout`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
          });
        } catch (error) {
          console.error("Logout API error:", error);
          // Continue with local logout even if API call fails
        }
      }

      // Clear secure storage
      await clearSession();

      // Clear state
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if storage clear fails, clear state
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  // Reset password function
  const resetPassword = async (
    email: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    try {
      return await authApi.resetPassword(email);
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        error: "Failed to send reset instructions. Please try again.",
      };
    }
  };

  // Update password function
  const updatePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    if (!accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      return await authApi.updatePassword(accessToken, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        error: "Password update failed. Please try again.",
      };
    }
  };

  // Restore session on mount
  useEffect(() => {
    restoreSession();
  }, []);

  // Context value
  const value: AuthContextType = {
    // State
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
    refreshTokens,
    restoreSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
