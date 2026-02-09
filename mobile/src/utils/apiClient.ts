import React from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "./consts";
import {
  getAccessToken,
  getRefreshToken,
  loadSession,
  saveSession,
} from "./secureStore";

// API client configuration
const API_BASE_URL = `${API_URL}/api`;

// Mutex to prevent concurrent refresh attempts
let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

// JWT utility functions
export const jwtUtils = {
  // Decode JWT token without verification (for checking expiration)
  decode: (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  },

  // Check if token is expired
  isExpired: (token: string): boolean => {
    const decoded = jwtUtils.decode(token);
    if (!decoded || !decoded.exp) {
      return true; // Treat invalid tokens as expired
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  },

  // Check if token will expire within specified seconds
  willExpireSoon: (token: string, withinSeconds: number = 60): boolean => {
    const decoded = jwtUtils.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime < withinSeconds;
  },
};

// Refresh token function
const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing) {
    return refreshPromise || Promise.resolve(false);
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      if (!refreshToken) {
        console.error("No refresh token available");
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          data.data;

        // Update secure storage
        const session = await loadSession();
        if (session) {
          await saveSession({
            ...session,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          });
        }

        console.log("Tokens refreshed successfully");
        return true;
      } else {
        console.error("Token refresh failed:", data.error);
        return false;
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// Enhanced fetch with automatic token refresh
export const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
): Promise<Response> => {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint}`;

  // Get current access token
  let accessToken = await getAccessToken();
  console.log("🚀 ~ apiClient ~ url:", { url, accessToken });

  // Check if token needs refresh before making request
  if (accessToken && jwtUtils.willExpireSoon(accessToken, 30)) {
    console.log(" Access token expiring soon, refreshing...");
    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      accessToken = await getAccessToken();
    }
  }

  // Prepare headers
  const headers = new Headers(options.headers || {});
  console.log("🚀 ~ apiClient ~ headers:", headers);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
    console.log(
      " API Client - Adding Authorization header:",
      `Bearer ${accessToken.substring(0, 20)}...`,
    );
  } else {
    console.log(" API Client - No access token available");
  }

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  console.log(" API Client - Making request to:", url);
  console.log(" API Client - Headers:", Object.fromEntries(headers.entries()));

  // Make initial request
  let response = await fetch(url, {
    ...options,
    headers,
  });
  console.log("🚀 ~ apiClient ~ response:", response);

  console.log(" API Client - Response status:", response.status);

  // If 401 Unauthorized, try to refresh and retry once
  if (response.status === 401 && accessToken) {
    console.log(" Received 401, attempting token refresh...");

    const refreshSuccess = await refreshAccessToken();
    if (refreshSuccess) {
      // Get new token and retry
      const newAccessToken = await getAccessToken();
      if (newAccessToken) {
        headers.set("Authorization", `Bearer ${newAccessToken}`);

        console.log(" Retrying request with new token...");
        response = await fetch(url, {
          ...options,
          headers,
        });
        console.log(" Retry response status:", response.status);
      }
    } else {
      // Refresh failed, token is invalid
      console.error(" Token refresh failed, user needs to re-authenticate");
      throw new Error("Authentication failed. Please login again.");
    }
  }

  return response;
};

// Typed API request function
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<{ success: boolean; data?: T; error?: any }> => {
  try {
    const response = await apiClient(endpoint, options);
    console.log("🚀 ~ apiRequest ~ response:", response);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("API request error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

// Hook for automatic token refresh
export const useTokenRefresh = () => {
  const { refreshTokens } = useAuth();

  // Set up periodic token refresh check
  React.useEffect(() => {
    const checkAndRefresh = async () => {
      const accessToken = await getAccessToken();
      if (accessToken && jwtUtils.willExpireSoon(accessToken, 300)) {
        // 5 minutes
        console.log("Periodic check: refreshing token...");
        await refreshTokens();
      }
    };

    // Check every 2 minutes
    const interval = setInterval(checkAndRefresh, 2 * 60 * 1000);

    // Initial check
    checkAndRefresh();

    return () => clearInterval(interval);
  }, [refreshTokens]);
};
