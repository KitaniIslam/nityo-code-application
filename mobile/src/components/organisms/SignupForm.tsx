import { useForm } from "@tanstack/react-form";
import React, { useState } from "react";
import { View, ViewStyle } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../theme/ThemeProvider";
import { signupSchema } from "../../validation/auth.schema";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { FormInput } from "../molecules/FormInput";
import { PasswordInput } from "../molecules/PasswordInput";

// SignupForm component props
export interface SignupFormProps {
  onLogin?: () => void;
  testID?: string;
}

// SignupForm component - handles user registration with form validation
export const SignupForm: React.FC<SignupFormProps> = ({ onLogin, testID }) => {
  const { colors, spacing } = useTheme();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TanStack Form setup with Zod validation
  const form = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await signup(
          value.fullname,
          value.email,
          value.password,
        );

        if (!result.success) {
          setError(result.error || "Registration failed");
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

  return (
    <View style={containerStyle} testID={testID}>
      <View style={formStyle}>
        {/* Header */}
        <Text
          variant="heading2"
          style={{ textAlign: "center", marginBottom: spacing.margin.lg }}
          testID={`${testID}-title`}
        >
          Create Account
        </Text>

        <Text
          variant="body"
          color={colors.textSecondary}
          style={{ textAlign: "center", marginBottom: spacing.margin.xl }}
        >
          Sign up to get started
        </Text>

        {/* Form */}
        <Field
          name="fullname"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.fullname.safeParse(value);
              if (!result.success) {
                return result.error.issues[0]?.message;
              }
            },
          }}
        >
          {(field) => (
            <FormInput
              label="Full Name"
              value={field.state.value}
              onChangeText={(value) => field.handleChange(value)}
              onBlur={() => field.handleBlur()}
              error={field.state.meta.errors[0]?.toString()}
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              testID={`${testID}-fullname`}
            />
          )}
        </Field>

        <Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              const result = signupSchema.shape.email.safeParse(value);
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
              const result = signupSchema.shape.password.safeParse(value);
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
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>

        {/* Footer link */}
        <View style={footerStyle}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Already have an account?{" "}
          </Text>
          {onLogin && (
            <Button
              onPress={onLogin}
              variant="ghost"
              size="sm"
              testID={`${testID}-login`}
            >
              Sign In
            </Button>
          )}
        </View>
      </View>
    </View>
  );
};
