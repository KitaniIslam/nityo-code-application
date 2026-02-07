import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

// Button component props
export interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

// Button component - atomic button with theme integration
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onPress,
  style,
  textStyle,
  testID,
}) => {
  const { colors, spacing } = useTheme();

  // Get button styles based on variant
  const getButtonStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
    };

    // Size variations
    const sizeStyles = {
      sm: {
        paddingHorizontal: spacing.padding.sm,
        paddingVertical: spacing.padding.xs,
        minHeight: 36,
      },
      md: {
        paddingHorizontal: spacing.padding.md,
        paddingVertical: spacing.padding.sm,
        minHeight: 44,
      },
      lg: {
        paddingHorizontal: spacing.padding.lg,
        paddingVertical: spacing.padding.md,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: disabled ? colors.textQuaternary : colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? colors.textQuaternary : colors.secondary,
      },
      outline: {
        backgroundColor: "transparent",
        borderWidth: 1,
        borderColor: disabled ? colors.textQuaternary : colors.primary,
      },
      ghost: {
        backgroundColor: "transparent",
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  // Get text styles based on variant
  const getTextStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: "600",
      textAlign: "center",
    };

    // Variant text colors
    const variantTextColors = {
      primary: colors.background,
      secondary: colors.background,
      outline: disabled ? colors.textQuaternary : colors.primary,
      ghost: disabled ? colors.textQuaternary : colors.primary,
    };

    return {
      ...baseStyle,
      color: variantTextColors[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyles(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === "outline" || variant === "ghost"
              ? colors.primary
              : colors.background
          }
        />
      ) : (
        <Text style={[getTextStyles(), textStyle]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
};
