import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { useForm } from "@tanstack/react-form";
import { useTheme } from "../../theme/ThemeProvider";
import { useAuth } from "../../context/AuthContext";
import { Text } from "../atoms/Text";
import { Button } from "../atoms/Button";
import { FormInput } from "../molecules/FormInput";
import { PasswordInput } from "../molecules/PasswordInput";
import { loginSchema } from "../../validation/auth.schema";
import { SafeAreaView } from "react-native-safe-area-context";

// LoginForm component props
export interface LoginFormProps {
  onSignup?: () => void;
  onResetPassword?: () => void;
  testID?: string;
}

// LoginForm component - handles user login with form validation
export const LoginForm: React.FC<LoginFormProps> = ({
  onSignup,
  onResetPassword,
  testID,
}) => {
  const { colors, spacing } = useTheme();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TanStack Form setup with Zod validation
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await login(value.email, value.password);

        if (!result.success) {
          setError(result.error || "Login failed");
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

  const linkStyle: ViewStyle = {
    marginTop: spacing.margin.sm,
  };

  return (
    <SafeAreaView style={containerStyle} testID={testID}>
      <View style={formStyle}>
        {/* Header */}
        <Text
          variant="heading2"
          style={{ textAlign: "center", marginBottom: spacing.margin.lg }}
          testID={`${testID}-title`}
        >
          Welcome Back
        </Text>

        <Text
          variant="body"
          color={colors.textSecondary}
          style={{ textAlign: "center", marginBottom: spacing.margin.xl }}
        >
          Sign in to your account
        </Text>

        {/* Form */}
        <Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.email.safeParse(value);
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

        <Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              const result = loginSchema.shape.password.safeParse(value);
              if (!result.success) {
                return result.error.issues[0]?.message;
              }
            },
          }}
        >
          {(field) => (
            <PasswordInput
              label="Password"
              value={field.state.value}
              onChangeText={(value) => field.handleChange(value)}
              onBlur={() => field.handleBlur()}
              error={field.state.meta.errors[0]?.toString()}
              testID={`${testID}-password`}
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
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>

        {/* Footer links */}
        <View style={footerStyle}>
          {onResetPassword && (
            <Button
              onPress={onResetPassword}
              variant="ghost"
              size="sm"
              testID={`${testID}-reset-password`}
            >
              Forgot Password?
            </Button>
          )}

          {onSignup && (
            <View style={linkStyle}>
              <Text variant="bodySmall" color={colors.textSecondary}>
                Don't have an account?{" "}
              </Text>
              <Button
                onPress={onSignup}
                variant="ghost"
                size="sm"
                testID={`${testID}-signup`}
              >
                Sign Up
              </Button>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
