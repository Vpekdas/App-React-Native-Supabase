import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, useColorScheme, useWindowDimensions, View } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

export function ThemedHero() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));
    const titleSize = Math.min(62, Math.max(40, width * 0.12)); // clamp(40..62)
    const titleLineHeight = Math.round(titleSize * 1.06);

    return (
        <ThemedView
            style={[
                styles.hero,
                {
                    backgroundColor: theme.background,
                    paddingHorizontal: horizontal,
                },
            ]}
        >
            {/* Glows */}
            <View style={styles.orbAWrap} pointerEvents="none">
                <LinearGradient colors={["rgba(14,159,110,0.14)", "rgba(14,159,110,0.0)"]} style={styles.orbA} />
            </View>
            <View style={styles.orbBWrap} pointerEvents="none">
                <LinearGradient colors={["rgba(200,155,60,0.10)", "rgba(200,155,60,0.0)"]} style={styles.orbB} />
            </View>

            <ThemedView style={styles.container}>
                <ThemedView style={styles.leftCol}>
                    <ThemedView
                        style={[styles.eyebrow, { backgroundColor: theme.mist, borderColor: "rgba(14,159,110,0.18)" }]}
                    >
                        <ThemedView style={[styles.eyebrowDot, { backgroundColor: theme.accent }]} />
                        <ThemedText style={[styles.eyebrowText, { color: theme.primary }]}>
                            Lancement 2026 · Candidats DEC
                        </ThemedText>
                    </ThemedView>

                    <ThemedText
                        style={[
                            styles.title,
                            {
                                color: theme.text,
                                fontSize: titleSize,
                                lineHeight: titleLineHeight,
                            },
                        ]}
                    >
                        Gagnez des mois sur votre{" "}
                        <ThemedText
                            style={[
                                styles.serif,
                                {
                                    color: theme.accent,
                                    fontSize: titleSize,
                                    lineHeight: titleLineHeight,
                                },
                            ]}
                        >
                            mémoire
                        </ThemedText>{" "}
                        DEC.
                    </ThemedText>

                    <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                        Et si un retour d'expérience ciblé vous ouvrait des angles auxquels vous n'auriez jamais pensé ?
                    </ThemedText>

                    <ThemedView style={styles.note}>
                        <ThemedView style={[styles.noteLine, { backgroundColor: theme.border }]} />
                        <ThemedText style={[styles.noteText, { color: theme.textMuted }]}>
                            Réseau spécialisé pour candidats au Diplôme d'Expertise Comptable
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.trust}>
                        <TrustItem text="100% dédié au DEC" theme={theme} />
                        <ThemedView style={[styles.separator, { backgroundColor: theme.border }]} />
                        <TrustItem text="Matching par sujet" theme={theme} />
                        <ThemedView style={[styles.separator, { backgroundColor: theme.border }]} />
                        <TrustItem text="Gratuit pour commencer" theme={theme} />
                    </ThemedView>
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

function TrustItem({ text, theme }: { text: string; theme: typeof Colors.light }) {
    return (
        <ThemedView style={styles.trustItem}>
            <ThemedView style={[styles.check, { backgroundColor: theme.mist }]}>
                <ThemedText style={[styles.checkText, { color: theme.accent }]}>✓</ThemedText>
            </ThemedView>
            <ThemedText style={[styles.trustText, { color: theme.textSecondary }]}>{text}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    hero: {
        paddingTop: 56,
        paddingBottom: 64,
        position: "relative",
        overflow: "hidden",
    },

    container: {
        width: "100%",
        maxWidth: 1240,
        alignSelf: "center",
        zIndex: 1,
    },

    leftCol: {
        width: "100%",
        maxWidth: 720,
    },

    orbAWrap: { position: "absolute", top: -140, right: -60 },
    orbBWrap: { position: "absolute", bottom: -80, left: -100 },

    orbA: { width: 460, height: 460, borderRadius: 230 },
    orbB: { width: 300, height: 300, borderRadius: 150 },

    eyebrow: {
        alignSelf: "flex-start",
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        borderWidth: 1,
        borderRadius: 100,
        paddingHorizontal: 16,
        paddingVertical: 7,
        marginBottom: 30,
    },
    eyebrowDot: { width: 6, height: 6, borderRadius: 3 },

    eyebrowText: {
        ...Typography.heroEyebrow,
    },

    title: {
        ...Typography.heroTitle,
        marginBottom: 26,
    },

    serif: {
        ...Typography.heroTitleSerif,
    },

    subtitle: {
        ...Typography.heroSub,
        maxWidth: 480,
        marginBottom: 14,
    },

    note: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 34,
    },

    noteLine: { width: 18, height: 1 },

    noteText: {
        ...Typography.heroNote,
    },

    trust: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 18,
    },

    trustItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 7,
    },

    check: {
        width: 19,
        height: 19,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },

    checkText: {
        fontFamily: Typography.badge.fontFamily, // or Fonts.sansBold
        fontSize: 10,
        lineHeight: 10,
    },

    trustText: {
        ...Typography.trustItem,
    },

    separator: {
        width: 1,
        height: 14,
    },
});
