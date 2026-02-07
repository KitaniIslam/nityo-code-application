import { useNavigation } from "@react-navigation/native";
import React from "react";
import { ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignupForm } from "../components/organisms/SignupForm";
import { useTheme } from "../theme/ThemeProvider";

type SignupScreenNavigationProp = any; // Simplified type for now

// Signup screen component
export const SignupScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<SignupScreenNavigationProp>();

  const handleLogin = () => {
    navigation.navigate("Login" as any);
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <SignupForm onLogin={handleLogin} testID="signup-screen" />
    </SafeAreaView>
  );
};
