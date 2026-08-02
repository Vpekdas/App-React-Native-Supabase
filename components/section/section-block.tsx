import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Platform, StyleSheet } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

interface SectionBlockProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function SectionBlock({ title, description, children }: SectionBlockProps) {
    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    return (
        <ThemedView style={styles.section}>
            <ThemedText
                style={[
                    styles.title,
                    {
                        color: colors.primary,
                    },
                ]}
            >
                {title}
            </ThemedText>

            {description && (
                <ThemedText
                    style={[
                        styles.description,
                        {
                            color: colors.textSecondary,
                        },
                    ]}
                >
                    {description}
                </ThemedText>
            )}

            <ThemedView style={[styles.cardRow, Platform.OS === "web" ? styles.rowWeb : styles.rowMobile]}>
                {children}
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 24,
        paddingTop: 32,
        paddingBottom: 20,
        marginBottom: 40,
        alignItems: "center",
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 34,
        lineHeight: 40,
        textAlign: "center",
        marginBottom: 12,
        maxWidth: 600,
    },

    description: {
        fontFamily: Fonts.sans,
        fontSize: 17,
        lineHeight: 28,
        textAlign: "center",
        marginBottom: 28,
        maxWidth: 650,
    },

    cardRow: {
        width: "100%",
        gap: 16,
    },

    rowMobile: {
        flexDirection: "column",
        alignItems: "center",
    },

    rowWeb: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "stretch",
        gap: 20,
    },
});
