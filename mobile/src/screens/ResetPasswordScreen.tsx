import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResetPasswordForm } from "../components/organisms/ResetPasswordForm";
import { useTheme } from "../theme/ThemeProvider";

type ResetPasswordScreenNavigationProp = any; // Simplified type for now

// Reset password screen component
export const ResetPasswordScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<ResetPasswordScreenNavigationProp>();

  const handleBack = () => {
    navigation.navigate("Login" as any);
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ResetPasswordForm onBack={handleBack} testID="reset-password-screen" />
    </SafeAreaView>
  );
};
