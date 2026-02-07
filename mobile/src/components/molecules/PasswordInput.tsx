import React, { useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { Text } from "../atoms/Text";
import { Input, InputProps } from "../atoms/Input";
import { ErrorMessage } from "./ErrorMessage";
import { useTheme } from "../../theme/ThemeProvider";

// PasswordInput component props
export interface PasswordInputProps extends Omit<
  InputProps,
  "testID" | "error" | "secureTextEntry"
> {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}

// PasswordInput component - input with toggle password visibility
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  testID,
  ...inputProps
}) => {
  const { colors, spacing } = useTheme();
  const [isSecure, setIsSecure] = useState(true);

  // Container style for the entire form input
  const formContainerStyle: ViewStyle = {
    marginBottom: spacing.form.fieldGap,
  };

  // Toggle password visibility
  const toggleSecure = () => {
    setIsSecure(!isSecure);
  };

  return (
    <View style={[formContainerStyle, containerStyle]} testID={testID}>
      {label && (
        <Text
          variant="label"
          style={{ marginBottom: spacing.margin.xs }}
          testID={`${testID}-label`}
        >
          {label}
          {required && (
            <Text variant="label" color="error">
              {" *"}
            </Text>
          )}
        </Text>
      )}

      <View style={{ position: "relative" }}>
        <Input
          {...inputProps}
          secureTextEntry={isSecure}
          error={!!error}
          testID={`${testID}-input`}
          style={{ paddingRight: 50 }} // Space for the toggle button
        />

        <TouchableOpacity
          onPress={toggleSecure}
          style={{
            position: "absolute",
            right: spacing.padding.sm,
            top: "50%",
            marginTop: -12, // Center the button vertically
            padding: spacing.padding.xs,
          }}
          testID={`${testID}-toggle`}
        >
          <Text
            variant="bodySmall"
            color={colors.primary}
            style={{ fontWeight: "600" }}
          >
            {isSecure ? "Show" : "Hide"}
          </Text>
        </TouchableOpacity>
      </View>

      <ErrorMessage message={error} testID={`${testID}-error`} />
    </View>
  );
};
