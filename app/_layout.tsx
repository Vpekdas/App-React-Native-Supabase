import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { SplashScreenController } from "@/components/splash-screen-controller";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import {
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_800ExtraBold,
} from "@expo-google-fonts/playfair-display";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
            <Stack.Screen name="verify-email" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const [fontsLoaded] = useFonts({
        Inter: Inter_400Regular,
        "Inter-Light": Inter_300Light,
        "Inter-Medium": Inter_500Medium,
        "Inter-SemiBold": Inter_600SemiBold,
        "Inter-Bold": Inter_700Bold,

        PlayfairDisplay: PlayfairDisplay_600SemiBold,
        "PlayfairDisplay-Bold": PlayfairDisplay_700Bold,
        "PlayfairDisplay-ExtraBold": PlayfairDisplay_800ExtraBold,
    });

    if (!fontsLoaded) return null;

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
