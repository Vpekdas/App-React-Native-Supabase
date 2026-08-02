import { BookOpen, Check, Users } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

const SOLUTIONS = [
    {
        type: "green",
        title: "Mise en relation",
        badge: "Bientôt disponible",
        description:
            "Entrez en contact avec un expert-comptable diplômé ayant traité votre sujet exact — pour un échange ciblé, concret et bienveillant.",
        icon: Users,
        items: [
            "Matching par proximité de sujet",
            "Session vidéo de 60 à 90 min",
            "Retour d'expérience réel, pas théorique",
            "Cadre clair et charte bilatérale",
        ],
    },
    {
        type: "gold",
        title: "Espace de travail",
        badge: "En développement",
        description:
            "Un workspace pensé pour le mémoire DEC — structure, rédaction, progression et ressources réunies au même endroit.",
        icon: BookOpen,
        items: [
            "Éditeur de rédaction intégré",
            "Suivi de progression personnalisé",
            "Ressources et méthodologie DEC",
            "Export Word natif",
        ],
    },
] as const;

export function ThemedSolution() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));
    const isDesktop = width > 960;

    return (
        <ThemedView
            style={[
                styles.section,
                {
                    backgroundColor: theme.background,
                    paddingHorizontal: horizontal,
                },
            ]}
        >
            <ThemedView style={styles.inner}>
                <ThemedText style={[styles.eyebrow, { color: theme.accent }]}>La solution</ThemedText>

                <ThemedText style={[styles.title, { color: theme.text }]}>
                    Deux piliers.{"\n"}
                    <ThemedText style={[styles.serif, { color: theme.accent }]}>Une seule plateforme.</ThemedText>
                </ThemedText>

                <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                    App-React-Native-Supabase réunit ce qui n'existait pas : la mise en relation par sujet et un espace de travail dédié,
                    pensés exclusivement pour le mémoire DEC.
                </ThemedText>

                <ThemedView style={styles.grid}>
                    {SOLUTIONS.map((solution) => (
                        <SolutionCard
                            key={solution.title}
                            solution={solution}
                            theme={theme}
                            width={isDesktop ? "48.8%" : "100%"}
                        />
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

function SolutionCard({
    solution,
    theme,
    width,
}: {
    solution: (typeof SOLUTIONS)[number];
    theme: typeof Colors.light;
    width: `${number}%`;
}) {
    const Icon = solution.icon;

    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const green = solution.type === "green";

    const accent = green ? theme.accent : theme.gold;
    const accentBg = green ? theme.mist : theme.goldLight;

    const animate = (active: boolean) => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: active ? -6 : 0,
                useNativeDriver: true,
                friction: 8,
            }),

            Animated.spring(scale, {
                toValue: active ? 1.015 : 1,
                useNativeDriver: true,
                friction: 8,
            }),
        ]).start();
    };

    return (
        <Pressable style={{ width }} onHoverIn={() => animate(true)} onHoverOut={() => animate(false)}>
            <Animated.View
                style={[
                    styles.card,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        shadowColor: theme.shadow,
                        transform: [
                            {
                                translateY,
                            },
                            {
                                scale,
                            },
                        ],
                    },
                ]}
            >
                <ThemedView
                    style={[
                        styles.topLine,
                        {
                            backgroundColor: accent,
                        },
                    ]}
                />

                <ThemedView style={styles.head}>
                    <ThemedView
                        style={[
                            styles.iconBox,
                            {
                                backgroundColor: accentBg,
                            },
                        ]}
                    >
                        <Icon size={23} color={accent} strokeWidth={1.6} />
                    </ThemedView>

                    <ThemedView
                        style={[
                            styles.badge,
                            {
                                backgroundColor: accentBg,
                                borderColor: green ? "rgba(14,159,110,0.25)" : "rgba(200,155,60,0.25)",
                            },
                        ]}
                    >
                        <ThemedText
                            style={[
                                styles.badgeText,
                                {
                                    color: accent,
                                },
                            ]}
                        >
                            {solution.badge}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                <ThemedText
                    style={[
                        styles.cardTitle,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    {solution.title}
                </ThemedText>

                <ThemedText
                    style={[
                        styles.description,
                        {
                            color: theme.textSecondary,
                        },
                    ]}
                >
                    {solution.description}
                </ThemedText>

                <ThemedView>
                    {solution.items.map((item) => (
                        <ThemedView
                            key={item}
                            style={[
                                styles.listItem,
                                {
                                    borderTopColor: theme.border,
                                },
                            ]}
                        >
                            <ThemedView
                                style={[
                                    styles.check,
                                    {
                                        backgroundColor: accentBg,
                                    },
                                ]}
                            >
                                <Check size={11} color={accent} strokeWidth={3} />
                            </ThemedView>

                            <ThemedText
                                style={[
                                    styles.listText,
                                    {
                                        color: theme.textSecondary,
                                    },
                                ]}
                            >
                                {item}
                            </ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: 80,
    },

    inner: {
        width: "100%",
        maxWidth: 1140,
        alignSelf: "center",
    },

    eyebrow: {
        ...Typography.sectionEyebrow,
        marginBottom: 18,
        includeFontPadding: false,
    },

    title: {
        ...Typography.h2,
        marginBottom: 18,
        includeFontPadding: false,
    },

    serif: {
        ...Typography.h2Serif,
        includeFontPadding: false,
    },

    subtitle: {
        ...Typography.sectionSub,
        maxWidth: 560,
        marginBottom: 52,
        includeFontPadding: false,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 22,
        justifyContent: "space-between",
    },

    card: {
        borderWidth: 1,
        borderRadius: 22,
        paddingVertical: 38,
        paddingHorizontal: 38,
        overflow: "hidden",
        minHeight: 420,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.08,
        shadowRadius: 16,

        elevation: 3,
    },

    topLine: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 4,
    },

    head: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 22,
    },

    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    badge: {
        paddingHorizontal: 13,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
    },

    badgeText: {
        ...Typography.badge,
        includeFontPadding: false,
    },

    cardTitle: {
        ...Typography.solutionTitle,
        marginBottom: 12,
        includeFontPadding: false,
    },

    description: {
        ...Typography.solutionDesc,
        marginBottom: 22,
        includeFontPadding: false,
    },

    listItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 11,
        borderTopWidth: 1,
        paddingVertical: 11,
    },

    check: {
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },

    listText: {
        ...Typography.solutionList,
        includeFontPadding: false,
    },
});
