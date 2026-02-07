import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginForm } from "../components/organisms/LoginForm";
import { useTheme } from "../theme/ThemeProvider";

type LoginScreenNavigationProp = any; // Simplified type for now

// Login screen component
export const LoginScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleSignup = () => {
    navigation.navigate("Signup" as any);
  };

  const handleResetPassword = () => {
    navigation.navigate("ResetPassword" as any);
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <LoginForm
        onSignup={handleSignup}
        onResetPassword={handleResetPassword}
        testID="login-screen"
      />
    </SafeAreaView>
  );
};
