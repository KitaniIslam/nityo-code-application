import React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

// Extended input props with theme integration
export interface InputProps extends Omit<RNTextInputProps, "style"> {
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  testID?: string;
}

// Input component - atomic text input with theme integration
export const Input: React.FC<InputProps> = ({
  variant = "default",
  size = "md",
  error = false,
  style,
  inputStyle,
  testID,
  ...props
}) => {
  const { colors, spacing, typography } = useTheme();

  // Get container styles based on variant and size
  const getContainerStyles = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      borderWidth: 1,
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
      default: {
        backgroundColor: colors.inputBackground,
        borderColor: error ? colors.inputBorderError : colors.inputBorder,
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: error ? colors.inputBorderError : colors.inputBorder,
      },
      filled: {
        backgroundColor: colors.backgroundSecondary,
        borderColor: "transparent",
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  // Get text input styles
  const getInputStyles = (): TextStyle => {
    const baseStyle: TextStyle = {
      ...typography.textStyles.input,
      color: colors.text,
    };

    // Add container properties that are also valid for TextStyle
    const containerStyle: TextStyle = {
      paddingHorizontal:
        variant === "default"
          ? spacing.padding.md
          : variant === "outline"
            ? spacing.padding.md
            : spacing.padding.lg,
      paddingVertical:
        variant === "default"
          ? spacing.padding.sm
          : variant === "outline"
            ? spacing.padding.sm
            : spacing.padding.md,
      minHeight: size === "sm" ? 36 : size === "md" ? 44 : 52,
      borderRadius: 8,
      borderWidth: 1,
      backgroundColor:
        variant === "default"
          ? colors.inputBackground
          : variant === "outline"
            ? "transparent"
            : colors.backgroundSecondary,
      borderColor: error
        ? colors.inputBorderError
        : variant === "filled"
          ? "transparent"
          : colors.inputBorder,
    };

    return {
      ...baseStyle,
      ...containerStyle,
    };
  };

  return (
    <RNTextInput
      style={[getInputStyles(), inputStyle]}
      placeholderTextColor={colors.textQuaternary}
      testID={testID}
      {...props}
    />
  );
};
