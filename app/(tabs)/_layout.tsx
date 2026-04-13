import NavBar from "@/components/themed-nav-bar";
import { useAuthContext } from "@/hooks/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const { isLoggedIn } = useAuthContext();

    return (
        <SafeAreaProvider>
            <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
                <AuthProvider>
                    <NavBar />
                    <StatusBar style="auto" />
                </AuthProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
