import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

const WHY_ITEMS = [
    {
        number: "01",
        title: "Gagner du temps",
        description:
            "Évitez des semaines de recherche et de tâtonnements. Accédez directement à quelqu'un qui a l'expérience qu'il vous faut.",
    },
    {
        number: "02",
        title: "Accéder à une expérience concrète",
        description:
            "Échangez avec un expert-comptable ayant travaillé sur une problématique proche de la vôtre. Un retour terrain, pas des conseils généraux.",
    },
    {
        number: "03",
        title: "Structurer votre mémoire",
        description:
            "Centralisez votre travail dans un espace conçu pour le DEC. Avancez avec clarté, des jalons définis et une progression visible.",
    },
];

export function ThemedWhy() {
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
                <ThemedText style={[styles.eyebrow, { color: theme.accent }]}>Pourquoi App-React-Native-Supabase</ThemedText>

                <ThemedText style={[styles.title, { color: theme.text }]}>
                    Ce que App-React-Native-Supabase
                    {"\n"}
                    <ThemedText style={[styles.serif, { color: theme.accent }]}>change concrètement.</ThemedText>
                </ThemedText>

                <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Trois raisons qui font la différence entre un mémoire réussi et des mois perdus à tâtonner.
                </ThemedText>

                <ThemedView style={styles.grid}>
                    {WHY_ITEMS.map((item) => (
                        <WhyCard key={item.number} item={item} theme={theme} width={isDesktop ? "31.8%" : "100%"} />
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

function WhyCard({
    item,
    theme,
    width,
}: {
    item: (typeof WHY_ITEMS)[number];
    theme: typeof Colors.light;
    width: `${number}%`;
}) {
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;
    const shadow = useRef(new Animated.Value(0.08)).current;

    const animate = (active: boolean) => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: active ? -4 : 0,
                useNativeDriver: true,
                friction: 8,
            }),

            Animated.spring(scale, {
                toValue: active ? 1.01 : 1,
                useNativeDriver: true,
                friction: 8,
            }),

            Animated.timing(shadow, {
                toValue: active ? 0.14 : 0.08,
                duration: 180,
                useNativeDriver: false,
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

                        shadowOpacity: shadow,

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
                <ThemedText style={[styles.number, { color: theme.accent }]}>{item.number}</ThemedText>

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
        gap: 20,
        justifyContent: "space-between",
        width: "100%",
    },

    card: {
        borderWidth: 1,
        borderRadius: 18,
        paddingVertical: 34,
        paddingHorizontal: 30,
        minHeight: 240,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowRadius: 16,
        elevation: 3,
    },

    number: {
        ...Typography.quoteMark,
        fontSize: 46,
        lineHeight: 46,
        marginBottom: 18,
        opacity: 0.85,
        includeFontPadding: false,
    },

    cardTitle: {
        ...Typography.cardTitleMd,
        fontSize: 17.5,
        marginBottom: 10,
        includeFontPadding: false,
    },

    cardDescription: {
        ...Typography.cardBodyMd,
        includeFontPadding: false,
    },
});
