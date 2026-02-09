// Central mobile app types

// User types
export interface User {
  id: string;
  email: string;
  fullname: string;
  created_at: string;
  updated_at: string;
}

// Auth token types
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// Auth state types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string | { message: string };
}

export interface AuthResponse extends ApiResponse<{
  user: User;
  accessToken: string;
  refreshToken: string;
}> {}

export interface RefreshTokenResponse extends ApiResponse<{
  accessToken: string;
  refreshToken: string;
}> {}

export interface ProfileResponse extends ApiResponse<User> {}

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

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Profile: undefined;
  ResetPassword: undefined;
  UpdatePassword: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Profile: undefined;
  UpdatePassword: undefined;
};

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  error: string;
  success: string;
  warning: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  screen: {
    padding: number;
    margin: number;
  };
  component: {
    padding: number;
    margin: number;
  };
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    lineHeight: number;
  };
  h2: {
    fontSize: number;
    fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    lineHeight: number;
  };
  h3: {
    fontSize: number;
    fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    lineHeight: number;
  };
  body: {
    fontSize: number;
    fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    lineHeight: number;
  };
  caption: {
    fontSize: number;
    fontWeight: 'bold' | 'normal' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    lineHeight: number;
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  isDark: boolean;
  name: 'light' | 'dark';
}

// Error types
export interface AppError {
  message: string;
  code?: string;
  statusCode?: number;
}

export interface FormError {
  field: string;
  message: string;
}

// Loading states
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Component props types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  editable?: boolean;
}
