import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, StyleSheet, useColorScheme } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { ThemedView } from "../view/themed-view";

type Props = {
    href: any;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
};

export default function ThemedItem({ href, label, icon }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <Link href={href} asChild>
            <Pressable
                style={({ pressed }) => [
                    styles.container,
                    {
                        borderBottomColor: theme.border,
                        opacity: pressed ? 0.6 : 1,
                    },
                ]}
            >
                <ThemedView style={styles.item}>
                    <Ionicons name={icon} size={20} color={theme.tabIconDefault} />

                    <ThemedText style={styles.label}>{label}</ThemedText>
                </ThemedView>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        minHeight: 64,
    },

    label: {
        fontSize: 16,
    },
});
