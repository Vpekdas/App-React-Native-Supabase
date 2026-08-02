import { Pressable, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

export function ThemedFooter() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));
    const isMobile = width <= 960;

    return (
        <ThemedView
            style={[
                styles.footer,
                isMobile && styles.footerMobile,
                {
                    backgroundColor: theme.background,
                    borderTopColor: theme.border,
                    paddingHorizontal: horizontal,
                },
            ]}
        >
            <ThemedView style={styles.logo}>
                <ThemedView style={[styles.mark, { backgroundColor: theme.accent }]}>
                    <ThemedText style={[styles.markText, { color: theme.surface }]}>M</ThemedText>
                </ThemedView>

                <ThemedText style={[styles.logoText, { color: theme.text }]}>App-React-Native-Supabase</ThemedText>
            </ThemedView>

            <ThemedView style={[styles.links, isMobile && styles.linksMobile]}>
                <FooterLink label="Fonctionnalités" color={theme.textSecondary} />
                <FooterLink label="Pourquoi App-React-Native-Supabase" color={theme.textSecondary} />
                <FooterLink label="Comment ça marche" color={theme.textSecondary} />
            </ThemedView>

            <ThemedText style={[styles.note, { color: theme.textMuted }]}>
                App-React-Native-Supabase.fr · Plateforme non-officielle
            </ThemedText>
        </ThemedView>
    );
}

function FooterLink({ label, color }: { label: string; color: string }) {
    return (
        <Pressable
            style={({ hovered, pressed }) => [
                styles.linkButton,
                hovered && styles.linkHovered,
                pressed && styles.linkPressed,
            ]}
        >
            <ThemedText
                style={[
                    styles.link,
                    {
                        color,
                    },
                ]}
            >
                {label}
            </ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    footer: {
        paddingVertical: 36,
        borderTopWidth: 1,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
    },

    footerMobile: {
        flexDirection: "column",
        alignItems: "center",
    },

    logo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
    },

    mark: {
        width: 26,
        height: 26,
        borderRadius: 7,
        alignItems: "center",
        justifyContent: "center",
    },

    markText: {
        ...Typography.badge,
        fontSize: 11,
        lineHeight: 12,
        letterSpacing: 0,
        textTransform: "none",
        includeFontPadding: false,
    },

    logoText: {
        ...Typography.cardTitleSm,
        fontSize: 15,
        lineHeight: 18,
        includeFontPadding: false,
    },

    links: {
        flexDirection: "row",
        alignItems: "center",
        gap: 24,
    },

    linksMobile: {
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 16,
    },

    linkButton: {
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderRadius: 6,
    },

    linkHovered: {
        opacity: 0.7,
        transform: [
            {
                translateY: -1,
            },
        ],
    },

    linkPressed: {
        opacity: 0.5,
    },

    link: {
        ...Typography.quoteAuthor,
        includeFontPadding: false,
    },

    note: {
        ...Typography.heroNote,
        includeFontPadding: false,
    },
});
