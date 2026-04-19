import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import "react-native-reanimated";

import { SplashScreenController } from "@/components/splash-screen-controller";

import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
    const { isLoggedIn, isLoading } = useAuthContext();

    if (isLoading) return null;

    return (
        <Stack>
            <Stack.Protected guard={isLoggedIn}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!isLoggedIn}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="resume" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();

    const isDark = colorScheme === "dark";

    return (
        <SafeAreaProvider>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
                <AuthProvider>
                    <SplashScreenController />
                    <RootNavigator />
                    <StatusBar style="auto" />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
    },
    image: {
        flex: 1,
        justifyContent: "center",
    },
});
