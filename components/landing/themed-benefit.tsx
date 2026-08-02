import { CheckSquare, LayoutGrid, Target, Users } from "lucide-react-native";
import { useRef } from "react";
import {
    Animated,
    Pressable,
    StyleSheet,
    useColorScheme,
    useWindowDimensions,
    type DimensionValue,
} from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

const BENEFITS = [
    {
        title: "Mise en relation spécialisée",
        description: "Un EC diplômé sur un sujet proche du vôtre — pas un mentor généraliste.",
        icon: Users,
    },
    {
        title: "100% dédié au DEC",
        description: "Conçu par et pour les candidats au Diplôme d'Expertise Comptable. Rien d'autre.",
        icon: Target,
    },
    {
        title: "Un espace de travail unique",
        description: "Rédaction, suivi, ressources — tout centralisé dans un seul outil pensé pour le mémoire.",
        icon: LayoutGrid,
    },
    {
        title: "Une méthodologie structurée",
        description: "Un parcours guidé, des jalons clairs, des repères concrets pour avancer sereinement.",
        icon: CheckSquare,
    },
];

export function ThemedBenefit() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));

    const isDesktop = width > 960;
    const isTablet = width > 600;

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
                <ThemedText style={[styles.eyebrow, { color: theme.accent }]}>Ce que vous obtenez</ThemedText>

                <ThemedText style={[styles.title, { color: theme.text }]}>
                    Tout ce qu'il vous faut,
                    {"\n"}
                    <ThemedText style={[styles.titleSerif, { color: theme.accent }]}>enfin réuni.</ThemedText>
                </ThemedText>

                <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Une plateforme conçue spécifiquement pour le mémoire DEC.
                </ThemedText>

                <ThemedView style={styles.grid}>
                    {BENEFITS.map((item) => (
                        <BenefitCard
                            key={item.title}
                            item={item}
                            theme={theme}
                            width={isDesktop ? "23.5%" : isTablet ? "48%" : "100%"}
                        />
                    ))}
                </ThemedView>
            </ThemedView>
        </ThemedView>
    );
}

function BenefitCard({
    item,
    theme,
    width,
}: {
    item: (typeof BENEFITS)[number];
    theme: typeof Colors.light;
    width: DimensionValue;
}) {
    const Icon = item.icon;

    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const animate = (hover: boolean) => {
        Animated.parallel([
            Animated.spring(translateY, {
                toValue: hover ? -4 : 0,
                useNativeDriver: true,
                friction: 8,
            }),

            Animated.spring(scale, {
                toValue: hover ? 1.015 : 1,
                useNativeDriver: true,
                friction: 8,
            }),
        ]).start();
    };

    return (
        <Pressable
            onHoverIn={() => animate(true)}
            onHoverOut={() => animate(false)}
            style={{
                width,
            }}
        >
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
                        styles.iconBox,
                        {
                            backgroundColor: theme.mist,
                        },
                    ]}
                >
                    <Icon size={21} color={theme.accent} strokeWidth={1.6} />
                </ThemedView>

                <ThemedText
                    style={[
                        styles.cardTitle,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    {item.title}
                </ThemedText>

                <ThemedText
                    style={[
                        styles.cardDescription,
                        {
                            color: theme.textSecondary,
                        },
                    ]}
                >
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

    titleSerif: {
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
        gap: 18,
        justifyContent: "space-between",
    },

    card: {
        borderWidth: 1,
        borderRadius: 18,
        paddingVertical: 28,
        paddingHorizontal: 24,
        minHeight: 220,

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
        marginBottom: 18,
    },

    cardTitle: {
        ...Typography.cardTitleSm,
        marginBottom: 8,
        includeFontPadding: false,
    },

    cardDescription: {
        ...Typography.cardBodySm,
        includeFontPadding: false,
    },
});
