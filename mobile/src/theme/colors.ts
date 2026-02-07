// Theme color tokens for light and dark modes
// System-aware theme that adapts to user preferences

export const lightColors = {
  // Primary brand colors
  primary: "#007AFF",
  primaryHover: "#0056CC",
  primaryLight: "#E3F2FD",

  // Secondary colors
  secondary: "#5856D6",
  secondaryHover: "#4240A8",
  secondaryLight: "#F3F2FF",

  // Semantic colors
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  info: "#007AFF",

  // Background colors
  background: "#FFFFFF",
  backgroundSecondary: "#F2F2F7",
  backgroundTertiary: "#FFFFFF",

  // Surface colors
  surface: "#FFFFFF",
  surfaceSecondary: "#F2F2F7",
  surfaceBorder: "#C6C6C8",

  // Text colors
  text: "#000000",
  textSecondary: "#3C3C43",
  textTertiary: "#3C3C4399",
  textQuaternary: "#3C3C4366",

  // Interactive states
  overlay: "#00000033",
  divider: "#C6C6C8",

  // Input colors
  inputBackground: "#FFFFFF",
  inputBorder: "#C6C6C8",
  inputBorderActive: "#007AFF",
  inputBorderError: "#FF3B30",

  // Shadow colors
  shadow: "#0000001A",
} as const;

export const darkColors = {
  // Primary brand colors
  primary: "#0A84FF",
  primaryHover: "#409CFF",
  primaryLight: "#1C1C1E",

  // Secondary colors
  secondary: "#5E5CE6",
  secondaryHover: "#7E7DFF",
  secondaryLight: "#2C2C2E",

  // Semantic colors
  success: "#30D158",
  warning: "#FF9F0A",
  error: "#FF453A",
  info: "#0A84FF",

  // Background colors
  background: "#000000",
  backgroundSecondary: "#1C1C1E",
  backgroundTertiary: "#2C2C2E",

  // Surface colors
  surface: "#1C1C1E",
  surfaceSecondary: "#2C2C2E",
  surfaceBorder: "#38383A",

  // Text colors
  text: "#FFFFFF",
  textSecondary: "#EBEBF5",
  textTertiary: "#EBEBF599",
  textQuaternary: "#EBEBF566",

  // Interactive states
  overlay: "#FFFFFF33",
  divider: "#38383A",

  // Input colors
  inputBackground: "#1C1C1E",
  inputBorder: "#38383A",
  inputBorderActive: "#0A84FF",
  inputBorderError: "#FF453A",

  // Shadow colors
  shadow: "#00000066",
} as const;

export type ColorTheme = typeof lightColors | typeof darkColors;
