import React from "react";
import { View, ViewStyle } from "react-native";
import { Text } from "../atoms/Text";
import { Input, InputProps } from "../atoms/Input";
import { ErrorMessage } from "./ErrorMessage";
import { useTheme } from "../../theme/ThemeProvider";

// FormInput component props
export interface FormInputProps extends Omit<InputProps, "testID" | "error"> {
  label?: string;
  error?: string;
  required?: boolean;
  containerStyle?: ViewStyle;
  testID?: string;
}

// FormInput component - combines label, input, and error message
export const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  required = false,
  containerStyle,
  testID,
  ...inputProps
}) => {
  const { spacing } = useTheme();

  // Container style for the entire form input
  const formContainerStyle: ViewStyle = {
    marginBottom: spacing.form.fieldGap,
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

      <Input {...inputProps} error={!!error} testID={`${testID}-input`} />

      <ErrorMessage message={error} testID={`${testID}-error`} />
    </View>
  );
};
