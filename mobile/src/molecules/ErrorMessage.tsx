import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { Text } from "../atoms/Text";
import { useTheme } from "../../theme/ThemeProvider";

// ErrorMessage component props
export interface ErrorMessageProps {
  message?: string;
  visible?: boolean;
  testID?: string;
}

// ErrorMessage component - displays validation or API errors
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  visible = true,
  testID,
}) => {
  const { colors, spacing } = useTheme();

  // Error message container style
  const containerStyle: ViewStyle = {
    marginTop: spacing.margin.xs,
    opacity: visible ? 1 : 0,
  };

  if (!message || !visible) {
    return null;
  }

  return (
    <View style={containerStyle} testID={testID}>
      <Text variant="caption" color={colors.error} testID={`${testID}-text`}>
        {message}
      </Text>
    </View>
  );
};
