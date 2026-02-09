import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useAuth } from "../context/AuthContext";
import { HomeScreen } from "../screens/HomeScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { ResetPasswordScreen } from "../screens/ResetPasswordScreen";
import { SignupScreen } from "../screens/SignupScreen";

// Navigation stack param types
export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  ResetPassword: undefined;
  Home: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

// Root navigator component - switches between auth and app flows
export const RootNavigator: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while restoring session
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="Home" component={HomeScreen} />
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
