import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { useForm } from "@tanstack/react-form";
import { useTheme } from "../../theme/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";
import { FormInput } from "../molecules/FormInput";
import { resetPasswordSchema } from "../../validation/auth.schema";

// ResetPasswordForm component props
export interface ResetPasswordFormProps {
  onBack?: () => void;
  testID?: string;
}

// ResetPasswordForm component - handles password reset requests
export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onBack,
  testID,
}) => {
  const { colors, spacing } = useTheme();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // TanStack Form setup with Zod validation
  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await resetPassword(value.email);

        if (result.success) {
          setSuccess(true);
        } else {
          setError(result.error || "Failed to send reset instructions");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const { Field, handleSubmit } = form;

  // Container styles
  const containerStyle: ViewStyle = {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.screen.padding,
    backgroundColor: colors.background,
  };

  const formStyle: ViewStyle = {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  };

  const footerStyle: ViewStyle = {
    marginTop: spacing.margin.lg,
    alignItems: "center",
  };

  // Show success state
  if (success) {
    return (
      <View style={containerStyle} testID={testID}>
        <View style={formStyle}>
          <Text
            variant="heading2"
            style={{ textAlign: "center", marginBottom: spacing.margin.lg }}
            testID={`${testID}-success-title`}
          >
            Check Your Email
          </Text>

          <Text
            variant="body"
            color={colors.textSecondary}
            style={{ textAlign: "center", marginBottom: spacing.margin.xl }}
          >
            We've sent password reset instructions to your email address.
          </Text>

          <Button
            onPress={onBack as any}
            variant="primary"
            size="lg"
            style={{ marginTop: spacing.margin.lg }}
            testID={`${testID}-back-button`}
          >
            Back to Login
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      <View style={formStyle}>
        {/* Header */}
        <Text
          variant="heading2"
          style={{ textAlign: "center", marginBottom: spacing.margin.lg }}
          testID={`${testID}-title`}
        >
          Reset Password
        </Text>

        <Text
          variant="body"
          color={colors.textSecondary}
          style={{ textAlign: "center", marginBottom: spacing.margin.xl }}
        >
          Enter your email address and we'll send you instructions to reset your
          password.
        </Text>

        {/* Form */}
        <Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = resetPasswordSchema.shape.email.safeParse(value);
              if (!result.success) {
                return result.error.issues[0]?.message;
              }
            },
          }}
        >
          {(field) => (
            <FormInput
              label="Email"
              value={field.state.value}
              onChangeText={(value) => field.handleChange(value)}
              onBlur={() => field.handleBlur()}
              error={field.state.meta.errors[0]?.toString()}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              testID={`${testID}-email`}
            />
          )}
        </Field>

        {/* General error message */}
        {error && (
          <Text
            variant="bodySmall"
            color={colors.error}
            style={{ textAlign: "center", marginTop: spacing.margin.sm }}
            testID={`${testID}-error`}
          >
            {error}
          </Text>
        )}

        {/* Submit button */}
        <Button
          onPress={handleSubmit}
          loading={isLoading}
          disabled={isLoading}
          variant="primary"
          size="lg"
          style={{ marginTop: spacing.margin.lg }}
          testID={`${testID}-submit`}
        >
          {isLoading ? "Sending..." : "Send Reset Instructions"}
        </Button>

        {/* Footer link */}
        <View style={footerStyle}>
          {onBack && (
            <Button
              onPress={onBack}
              variant="ghost"
              size="sm"
              testID={`${testID}-back`}
            >
              Back to Login
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};
