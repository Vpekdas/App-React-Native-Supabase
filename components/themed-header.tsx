import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedButton from "./buttons/themed-button";
import { ThemedText } from "./text/themed-text";
import { ThemedView } from "./themed-view";

type ThemedHeaderProps = {
    onNavigate: (id: string) => void;
};

type NavItemProps = {
    label: string;
    color: string;
    onPress: () => void;
};

export default function ThemedHeader({ onNavigate }: ThemedHeaderProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <SafeAreaView>
            <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
                <ThemedView style={styles.site}>
                    <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
                    <ThemedView style={styles.textContainer}>
                        <ThemedText style={styles.name}>MémoDec</ThemedText>
                        <ThemedText style={styles.description}>Retours d’expérience par sujet</ThemedText>
                    </ThemedView>
                </ThemedView>
                <NavItem label="Comment ça marche" onPress={() => onNavigate("Comment ça marche")} color={theme.text} />
                <NavItem label="Thématiques" onPress={() => onNavigate("Thématiques couvertes")} color={theme.text} />
                <NavItem label="Chartes" onPress={() => onNavigate("Chartes MémoDEC")} color={theme.text} />
                <ThemedButton
                    title={"Se connecter"}
                    onPress={function (): void {
                        router.push("/login");
                    }}
                ></ThemedButton>
            </ThemedView>
        </SafeAreaView>
    );
}

function NavItem({ label, color, onPress }: NavItemProps) {
    return (
        <Pressable style={styles.item} onPress={onPress}>
            <Text style={[styles.text, { color }]}>{label}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        borderBottomWidth: 1,
        padding: 10,
        alignItems: "center",
        flexWrap: "wrap",
    },
    item: {
        paddingHorizontal: 8,
        paddingVertical: 6,
    },

    textContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },
    text: {
        fontSize: 14,
        fontWeight: "500",
    },
    site: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        gap: 10,
        flexShrink: 1,
    },
    logo: {
        width: 40,
        height: 40,
        borderRadius: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: "600",
    },

    description: {
        fontSize: 12,
        opacity: 0.7,
    },
});
