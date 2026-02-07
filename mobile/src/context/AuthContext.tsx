import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { authApi } from "../api/auth.api";
import {
  saveSession,
  loadSession,
  clearSession,
  AuthSession,
} from "../utils/secureStore";
import { User } from "../types/auth";

// Auth context type definitions
export interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
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
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed state
  const isAuthenticated = !!user && !!token;

  // Restore session on app startup
  const restoreSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const session = await loadSession();

      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      // Clear corrupted session
      await clearSession();
    } finally {
      setIsLoading(false);
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
        const { user: userData, token: userToken } = response.data;

        // Save session to secure storage
        const sessionSaved = await saveSession({
          user: userData,
          token: userToken,
        });

        if (sessionSaved) {
          // Update state
          setUser(userData);
          setToken(userToken);

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
        const { user: userData, token: userToken } = response.data;

        // Save session to secure storage
        const sessionSaved = await saveSession({
          user: userData,
          token: userToken,
        });

        if (sessionSaved) {
          // Update state
          setUser(userData);
          setToken(userToken);

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
      // Clear secure storage
      await clearSession();

      // Clear state
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
      // Even if storage clear fails, clear state
      setUser(null);
      setToken(null);
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
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      return await authApi.updatePassword(token, {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error("Update password error:", error);
      return {
        success: false,
        error: "Failed to update password. Please try again.",
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
    token,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    signup,
    logout,
    resetPassword,
    updatePassword,
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
