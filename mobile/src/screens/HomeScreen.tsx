import React from "react";
import { ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

// Home screen component
export const HomeScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  };

  const contentStyle: ViewStyle = {
    flex: 1,
    paddingHorizontal: spacing.screen.padding,
    paddingTop: spacing.screen.padding,
  };

  const profileStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.padding.lg,
    marginBottom: spacing.margin.lg,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  };

  const actionsStyle: ViewStyle = {
    alignItems: "center",
    marginTop: spacing.margin.xl,
  };

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView style={contentStyle} showsVerticalScrollIndicator={false}>
        {/* Welcome message */}
        <Text
          variant="heading1"
          style={{ textAlign: "center", marginBottom: spacing.margin.lg }}
          testID="home-welcome"
        >
          Welcome Back!
        </Text>

        {/* User profile card */}
        <View style={profileStyle} testID="home-profile">
          <Text variant="heading3" style={{ marginBottom: spacing.margin.sm }}>
            {user?.fullname}
          </Text>
          <Text variant="body" color={colors.textSecondary}>
            {user?.email}
          </Text>
        </View>

        {/* App content placeholder */}
        <View style={{ alignItems: "center", marginTop: spacing.margin.xxl }}>
          <Text variant="body" color={colors.textSecondary}>
            Your authenticated content would go here
          </Text>
        </View>

        {/* Logout button */}
        <View style={actionsStyle}>
          <Button
            onPress={handleLogout}
            variant="secondary"
            size="lg"
            style={{ width: "100%", maxWidth: 300 }}
            testID="home-logout"
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
