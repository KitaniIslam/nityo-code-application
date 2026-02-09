import React from "react";
import {
  Platform,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

export interface InputProps extends Omit<RNTextInputProps, "style"> {
  variant?: "default" | "outline" | "filled";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  rightIcon?: React.ReactNode;
  testID?: string;
}

export const Input: React.FC<InputProps> = ({
  variant = "default",
  size = "md",
  error = false,
  style,
  inputStyle,
  rightIcon,
  testID,
  ...props
}) => {
  const { colors, spacing, typography } = useTheme();

  const sizeConfig = {
    sm: { height: 36, paddingHorizontal: spacing.padding.sm },
    md: { height: 44, paddingHorizontal: spacing.padding.md },
    lg: { height: 52, paddingHorizontal: spacing.padding.lg },
  };

  const containerStyle: ViewStyle = {
    height: sizeConfig[size].height,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:
      variant === "filled"
        ? colors.backgroundSecondary
        : variant === "outline"
          ? "transparent"
          : colors.inputBackground,
    borderColor:
      error && variant !== "filled"
        ? colors.inputBorderError
        : colors.inputBorder,
  };

  const inputBaseStyle: TextStyle = {
    ...typography.textStyles.input,
    color: colors.text,
    flex: 1,
    height: "100%",
    paddingHorizontal: sizeConfig[size].paddingHorizontal,
    paddingVertical: 0,
    textAlignVertical: "center", // Android
    ...(Platform.OS === "ios" && {
      paddingTop: 0,
      paddingBottom: 0,
    }),
  };

  return (
    <View style={[containerStyle, style]}>
      <RNTextInput
        {...props}
        style={[inputBaseStyle, inputStyle]}
        placeholderTextColor={colors.textQuaternary}
        testID={testID}
      />

      {rightIcon && (
        <View
          style={{
            paddingRight: sizeConfig[size].paddingHorizontal,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {rightIcon}
        </View>
      )}
    </View>
  );
};
