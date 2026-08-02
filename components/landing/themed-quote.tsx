import { StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

export function ThemedQuote() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));

    return (
        <ThemedView
            style={[
                styles.section,
                {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    paddingHorizontal: horizontal,
                },
            ]}
        >
            <ThemedView style={styles.inner}>
                <ThemedText style={[styles.mark, { color: theme.accent }]}>"</ThemedText>

                <ThemedText style={[styles.quote, { color: theme.text }]}>
                    Trouver quelqu'un ayant traité une thématique proche aurait changé les six premiers mois de mon
                    mémoire. C'est précisément ce que App-React-Native-Supabase construit.
                </ThemedText>

                <ThemedView style={styles.author}>
                    <ThemedView style={[styles.dash, { backgroundColor: theme.border }]} />

                    <ThemedText style={[styles.authorText, { color: theme.textMuted }]}>
                        <ThemedText style={[styles.authorStrong, { color: theme.textSecondary }]}>
                            Expert-comptable diplômé
                        </ThemedText>
                        {" · Promotion 2023 · Paris"}
                    </ThemedText>

                    <ThemedView style={[styles.dash, { backgroundColor: theme.border }]} />
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    section: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 80,
    },

    inner: {
        width: "100%",
        maxWidth: 680,
        alignSelf: "center",
        alignItems: "center",
    },

    mark: {
        ...Typography.quoteMark,
        opacity: 0.2,
        marginBottom: 22,
        includeFontPadding: false,
    },

    quote: {
        ...Typography.quoteText,
        textAlign: "center",
        marginBottom: 24,
        includeFontPadding: false,
    },

    author: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },

    dash: {
        width: 26,
        height: 1,
    },

    authorText: {
        ...Typography.quoteAuthor,
        textAlign: "center",
        includeFontPadding: false,
    },

    authorStrong: {
        ...Typography.bodyMedium,
        fontSize: 13,
        lineHeight: 18,
        includeFontPadding: false,
    },
});
