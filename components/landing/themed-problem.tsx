import { AlertCircle, Layers, Search } from "lucide-react-native";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

const PROBLEMS = [
    {
        title: "Aucun retour d'expérience ciblé",
        description: "Les échanges généraux ne suffisent pas pour avancer sur une problématique précise.",
        icon: Search,
    },
    {
        title: "Des outils inadaptés",
        description:
            "Word, Drive, Notion, WhatsApp, Zotero… La rédaction d'un mémoire de qualité ne devrait pas nécessiter dix applications.",
        icon: Layers,
    },
    {
        title: "Pas de cadre méthodologique",
        description:
            "Les attentes du jury varient, les critères évoluent. Les candidats avancent avec des repères insuffisants.",
        icon: AlertCircle,
    },
];

export function ThemedProblem() {
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
                    backgroundColor: theme.mist,
                    paddingHorizontal: horizontal,
                },
            ]}
        >
            <ThemedView style={styles.inner}>
                <ThemedText style={[styles.eyebrow, { color: theme.accent }]}>Le problème</ThemedText>

                <ThemedText style={[styles.title, { color: theme.text }]}>
                    Préparer le mémoire DEC est{"\n"}
                    inutilement <ThemedText style={[styles.gold, { color: theme.gold }]}>solitaire.</ThemedText>
                </ThemedText>

                <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Les candidats avancent seuls, sans repères précis, sans accès à une expérience concrète sur leur
                    sujet spécifique.
                </ThemedText>

                <ThemedView style={styles.grid}>
                    {PROBLEMS.map((item) => (
                        <ProblemCard key={item.title} item={item} theme={theme} width={isDesktop ? "31.8%" : "100%"} />
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

function ProblemCard({
    item,
    theme,
    width,
}: {
    item: (typeof PROBLEMS)[number];
    theme: typeof Colors.light;
    width: `${number}%`;
}) {
    const Icon = item.icon;

    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const animate = (active: boolean) => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: active ? -5 : 0,
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
                        transform: [{ translateY }, { scale }],
                    },
                ]}
            >
                <ThemedView
                    style={[
                        styles.iconBox,
                        {
                            backgroundColor: theme.goldLight,
                        },
                    ]}
                >
                    <Icon size={21} color={theme.gold} strokeWidth={1.6} />
                </ThemedView>

                <ThemedText style={[styles.cardTitle, { color: theme.text }]}>{item.title}</ThemedText>

                <ThemedText style={[styles.cardDescription, { color: theme.textSecondary }]}>
                    {item.description}
                </ThemedText>
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
    },

    title: {
        ...Typography.h2,
        marginBottom: 18,
    },

    gold: {
        ...Typography.h2Serif,
    },

    subtitle: {
        ...Typography.sectionSub,
        maxWidth: 560,
        marginBottom: 52,
    },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 20,
        justifyContent: "space-between",
    },

    card: {
        borderWidth: 1,
        borderRadius: 18,
        paddingVertical: 32,
        paddingHorizontal: 28,
        minHeight: 240,

        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.08,
        shadowRadius: 16,

        elevation: 3,
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
    },

    cardTitle: {
        ...Typography.cardTitleMd,
        marginBottom: 10,
    },

    cardDescription: {
        ...Typography.cardBodyMd,
    },
});
