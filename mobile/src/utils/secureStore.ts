import * as SecureStore from "expo-secure-store";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_ID: "user_id",
  USER_EMAIL: "user_email",
  USER_NAME: "user_name",
} as const;

// User data interface for storage
export interface StoredUser {
  id: string;
  email: string;
  fullname: string;
}

// Authentication session interface
export interface AuthSession {
  user: StoredUser;
  accessToken: string;
  refreshToken: string;
}

// Save authentication session securely
export const saveSession = async (session: AuthSession): Promise<boolean> => {
  try {
    await Promise.all([
      SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, session.accessToken),
      SecureStore.setItemAsync(
        STORAGE_KEYS.REFRESH_TOKEN,
        session.refreshToken,
      ),
      SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, session.user.id),
      SecureStore.setItemAsync(STORAGE_KEYS.USER_EMAIL, session.user.email),
      SecureStore.setItemAsync(STORAGE_KEYS.USER_NAME, session.user.fullname),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to save session:", error);
    return false;
  }
};

// Load authentication session from secure storage
export const loadSession = async (): Promise<AuthSession | null> => {
  try {
    const [accessToken, refreshToken, userId, userEmail, userName] =
      await Promise.all([
        SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
        SecureStore.getItemAsync(STORAGE_KEYS.USER_ID),
        SecureStore.getItemAsync(STORAGE_KEYS.USER_EMAIL),
        SecureStore.getItemAsync(STORAGE_KEYS.USER_NAME),
      ]);

    // Check if all required data exists
    if (!accessToken || !refreshToken || !userId || !userEmail || !userName) {
      return null;
    }

    const user: StoredUser = {
      id: userId,
      email: userEmail,
      fullname: userName,
    };

    return { user, accessToken, refreshToken };
  } catch (error) {
    console.error("Failed to load session:", error);
    return null;
  }
};

// Clear authentication session from secure storage
export const clearSession = async (): Promise<boolean> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_EMAIL),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_NAME),
    ]);
    return true;
  } catch (error) {
    console.error("Failed to clear session:", error);
    return false;
  }
};

// Get access token only
export const getAccessToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error("Failed to get access token:", error);
    return null;
  }
};

// Get refresh token only
export const getRefreshToken = async (): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error("Failed to get refresh token:", error);
    return null;
  }
};

// Check if session exists
export const hasSession = async (): Promise<boolean> => {
  try {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    return !!token;
  } catch (error) {
    console.error("Failed to check session:", error);
    return false;
  }
};
