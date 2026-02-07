import React from "react";
import { Text as RNText, TextStyle } from "react-native";
import { useTheme } from "../../theme/ThemeProvider";

// Text component props
export interface TextProps {
  children: React.ReactNode;
  variant?: keyof typeof themeVariants;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  textAlign?: "auto" | "left" | "right" | "center" | "justify";
  testID?: string;
}

// Predefined text variants using theme typography
const themeVariants = {
  display: "display",
  heading1: "heading1",
  heading2: "heading2",
  heading3: "heading3",
  bodyLarge: "bodyLarge",
  body: "body",
  bodySmall: "bodySmall",
  caption: "caption",
  button: "button",
  input: "input",
  label: "label",
} as const;

// Text component - atomic text element with theme integration
export const Text: React.FC<TextProps> = ({
  children,
  variant = "body",
  color,
  style,
  numberOfLines,
  textAlign,
  testID,
}) => {
  const { colors, typography } = useTheme();

  // Get typography styles for the variant
  const typographyStyle = typography.textStyles[themeVariants[variant]];

  // Combine styles with theme colors
  const textStyle: TextStyle = {
    ...typographyStyle,
    color: color || colors.text,
    textAlign,
  };

  return (
    <RNText
      style={[textStyle, style]}
      numberOfLines={numberOfLines}
      testID={testID}
    >
      {children}
    </RNText>
  );
};
