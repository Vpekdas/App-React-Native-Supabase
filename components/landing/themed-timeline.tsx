import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme, useWindowDimensions } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

const STEPS = [
    {
        number: "01",
        title: "Décrivez votre sujet",
        description:
            "Renseignez votre sujet, votre angle et vos mots-clés. La précision du matching dépend de la précision de votre description.",
    },
    {
        number: "02",
        title: "On identifie votre profil",
        description:
            "App-React-Native-Supabase identifie un expert-comptable diplômé ayant traité une thématique identique ou très proche de la vôtre.",
    },
    {
        number: "03",
        title: "Vous échangez",
        description:
            "Une session vidéo ponctuelle, un retour d'expérience réel. Encadré par une charte claire, bienveillante et concrète.",
    },
];

export function ThemedTimeline() {
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
                <ThemedText style={[styles.eyebrow, { color: theme.accent }]}>Comment ça marche</ThemedText>

                <ThemedText style={[styles.title, { color: theme.text }]}>
                    Simple, ciblé, <ThemedText style={[styles.serif, { color: theme.accent }]}>efficace.</ThemedText>
                </ThemedText>

                <ThemedView style={[styles.steps, !isDesktop && styles.stepsMobile]}>
                    {isDesktop && (
                        <ThemedView
                            style={[
                                styles.line,
                                {
                                    backgroundColor: theme.borderStrong,
                                },
                            ]}
                        />
                    )}

                    {STEPS.map((step, idx) => (
                        <TimelineStep
                            key={step.number}
                            step={step}
                            theme={theme}
                            isFirst={idx === 0}
                            isMobile={!isDesktop}
                        />
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

function TimelineStep({
    step,
    theme,
    isFirst,
}: {
    step: (typeof STEPS)[number];
    theme: typeof Colors.light;
    isFirst: boolean;
    isMobile: boolean;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const animate = (active: boolean) => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: active ? 1.08 : 1,
                useNativeDriver: true,
                friction: 8,
            }),

            Animated.spring(translateY, {
                toValue: active ? -3 : 0,
                useNativeDriver: true,
                friction: 8,
            }),
        ]).start();
    };

    return (
        <ThemedView style={styles.step}>
            <Pressable onHoverIn={() => animate(true)} onHoverOut={() => animate(false)}>
                <Animated.View
                    style={{
                        transform: [
                            {
                                scale,
                            },
                            {
                                translateY,
                            },
                        ],
                    }}
                >
                    <ThemedView
                        style={[
                            styles.numberCircle,
                            isFirst
                                ? {
                                      backgroundColor: theme.accent,
                                      shadowColor: theme.accent,
                                      borderColor: "transparent",
                                      borderWidth: 0,
                                  }
                                : {
                                      backgroundColor: theme.surface,
                                      borderColor: theme.border,
                                      borderWidth: 2,
                                      shadowColor: theme.shadow,
                                  },
                        ]}
                    >
                        <ThemedText
                            style={[
                                styles.number,
                                {
                                    color: isFirst ? "#FFFFFF" : theme.accent,
                                },
                            ]}
                        >
                            {step.number}
                        </ThemedText>
                    </ThemedView>
                </Animated.View>
            </Pressable>

            <ThemedText
                style={[
                    styles.stepTitle,
                    {
                        color: theme.text,
                    },
                ]}
            >
                {step.title}
            </ThemedText>

            <ThemedText
                style={[
                    styles.stepDescription,
                    {
                        color: theme.textSecondary,
                    },
                ]}
            >
                {step.description}
            </ThemedText>
        </ThemedView>
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
        marginBottom: 20,
        includeFontPadding: false,
    },

    serif: {
        ...Typography.h2Serif,
        includeFontPadding: false,
    },

    steps: {
        flexDirection: "row",
        justifyContent: "space-between",
        position: "relative",
        marginTop: 56,
        gap: 36,
    },

    stepsMobile: {
        flexDirection: "column",
        gap: 36,
        marginTop: 40,
    },

    line: {
        position: "absolute",
        top: 30,
        left: "16%",
        right: "16%",
        height: 2,
    },

    step: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 14,
    },

    numberCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 22,

        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 5,
        },

        elevation: 4,
    },

    number: {
        ...Typography.buttonLg,
        fontSize: 16,
        lineHeight: 18,
        includeFontPadding: false,
    },

    stepTitle: {
        ...Typography.cardTitleMd,
        fontSize: 16,
        textAlign: "center",
        marginBottom: 10,
        includeFontPadding: false,
    },

    stepDescription: {
        ...Typography.cardBodyMd,
        textAlign: "center",
        lineHeight: 23,
        includeFontPadding: false,
    },
});
