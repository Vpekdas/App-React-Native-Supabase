import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Pressable, StyleSheet, useColorScheme, View } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { ThemedView } from "../view/themed-view";

const SUBJECTS = [
    "Fiscalité des cryptoactifs",
    "Consolidation des groupes",
    "RSE et reporting extra-financier",
    "Transmission d'entreprise familiale",
    "Facturation électronique",
    "Évaluation de titres non cotés",
    "Audit des systèmes d'information",
    "Restructuration et retournement",
    "Intégration fiscale",
    "Commissariat aux apports",
    "Holding animatrice",
    "Pilotage de la data en cabinet",
];

export function DecSubjectsMarquee() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const progress = useRef(new Animated.Value(0)).current;
    const loopRef = useRef<Animated.CompositeAnimation | null>(null);

    const [oneSetWidth, setOneSetWidth] = useState(0);

    const start = () => {
        if (!oneSetWidth) return;
        progress.setValue(0);
        loopRef.current?.stop();

        loopRef.current = Animated.loop(
            Animated.timing(progress, {
                toValue: 1,
                duration: 46000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        );

        loopRef.current.start();
    };

    const stop = () => {
        loopRef.current?.stop();
    };

    useEffect(() => {
        start();
        return stop;
    }, [oneSetWidth]);

    const translateX = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -oneSetWidth],
    });

    return (
        <ThemedView style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ThemedView style={styles.header}>
                <ThemedView style={[styles.headerLine, { backgroundColor: theme.border }]} />
                <ThemedText style={[styles.label, { color: theme.textMuted }]}>
                    Ils cherchent un retour d'expérience sur…
                </ThemedText>
                <ThemedView style={[styles.headerLine, { backgroundColor: theme.border }]} />
            </ThemedView>

            <Pressable onPressIn={stop} onPressOut={start}>
                <View style={styles.viewport}>
                    <Animated.View
                        style={[
                            styles.track,
                            {
                                transform: [{ translateX }],
                            },
                        ]}
                    >
                        <ThemedView
                            style={styles.row}
                            onLayout={(e) => {
                                const w = e.nativeEvent.layout.width;
                                if (w && w !== oneSetWidth) setOneSetWidth(w);
                            }}
                        >
                            {SUBJECTS.map((subject, index) => (
                                <Item key={`a-${index}`} subject={subject} theme={theme} />
                            ))}
                        </ThemedView>

                        <ThemedView style={styles.row}>
                            {SUBJECTS.map((subject, index) => (
                                <Item key={`b-${index}`} subject={subject} theme={theme} />
                            ))}
                        </ThemedView>
                    </Animated.View>

                    <View pointerEvents="none" style={styles.leftFade} />
                    <View pointerEvents="none" style={styles.rightFade} />
                </View>
            </Pressable>
        </ThemedView>
    );
}

function Item({ subject, theme }: { subject: string; theme: any }) {
    return (
        <ThemedView
            style={[
                styles.item,
                {
                    backgroundColor: theme.mist,
                    borderColor: theme.borderStrong,
                },
            ]}
        >
            <ThemedText style={[styles.icon, { color: theme.gold }]}>◆</ThemedText>
            <ThemedText numberOfLines={1} style={[styles.itemText, { color: theme.primary }]}>
                {subject}
            </ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingVertical: 26,
        overflow: "hidden",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        marginBottom: 18,
        paddingHorizontal: 24,
    },
    headerLine: {
        width: 90,
        height: 1,
    },
    label: {
        ...Typography.body,
        fontSize: 10.5,
        fontWeight: "600",
        letterSpacing: 1.4,
        textTransform: "uppercase",
    },
    viewport: {
        width: "100%",
        overflow: "hidden",
        position: "relative",
    },
    track: {
        flexDirection: "row",
        alignItems: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginHorizontal: 7,
        borderWidth: 1,
        borderRadius: 999,
    },
    icon: {
        fontSize: 8,
    },
    itemText: {
        ...Typography.body,
        fontSize: 13.5,
        fontWeight: "500",
    },

    leftFade: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 24,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
    rightFade: {
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: 24,
        backgroundColor: "rgba(255,255,255,0.8)",
    },
});
