import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authApi } from "../api/auth.api";
import { Button } from "../components/atoms/Button";
import { Text } from "../components/atoms/Text";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeProvider";

// Home screen component
export const HomeScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const { user, token, logout } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
  };

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;

      try {
        setLoading(true);
        setError(null);
        const response = await authApi.getProfile(token);
        if (response.success && response.user) {
          setProfileData(response.user);
        } else {
          setError(response.error || "Failed to fetch profile");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user, token]);

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

        {/* Profile content */}
        <View style={{ alignItems: "center", marginTop: spacing.margin.xxl }}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : error ? (
            <Text variant="body" color={colors.error}>
              {error}
            </Text>
          ) : profileData ? (
            <View style={{ alignItems: "center" }}>
              <Text
                variant="heading3"
                style={{ marginBottom: spacing.margin.sm }}
              >
                Profile Data
              </Text>
              <Text
                variant="body"
                color={colors.textSecondary}
                style={{ marginBottom: spacing.margin.xs }}
              >
                ID: {profileData.id}
              </Text>
              <Text
                variant="body"
                color={colors.textSecondary}
                style={{ marginBottom: spacing.margin.xs }}
              >
                Email: {profileData.email}
              </Text>
              <Text
                variant="body"
                color={colors.textSecondary}
                style={{ marginBottom: spacing.margin.xs }}
              >
                Name: {profileData.fullname}
              </Text>
              <Text variant="bodySmall" color={colors.textTertiary}>
                Member since:{" "}
                {new Date(profileData.created_at).toLocaleDateString()}
              </Text>
            </View>
          ) : (
            <Text variant="body" color={colors.textSecondary}>
              No profile data available
            </Text>
          )}
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
