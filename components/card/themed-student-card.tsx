import { Colors } from "@/constants/theme";
import React, { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

export type ThemedStudentCardProps = {
    first_name: string;
    last_name: string;
    topic: string;
    topic_description?: string;
    onPress?: () => void;
    style?: ViewStyle;
};

export default function ThemedStudentCard({
    first_name,
    last_name,
    topic,
    topic_description,
    onPress,
    style,
}: ThemedStudentCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const scale = useRef(new Animated.Value(1)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const animateIn = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1.02,
                useNativeDriver: true,
                friction: 7,
            }),

            Animated.spring(translateY, {
                toValue: -3,
                useNativeDriver: true,
                friction: 7,
            }),
        ]).start();
    };

    const animateOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 7,
            }),

            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                friction: 7,
            }),
        ]).start();
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            onHoverIn={animateIn}
            onHoverOut={animateOut}
            onPressIn={animateIn}
            onPressOut={animateOut}
        >
            <Animated.View
                style={{
                    transform: [{ scale }, { translateY }],
                }}
            >
                <ThemedView
                    style={[
                        styles.container,
                        {
                            borderColor: theme.border,
                            backgroundColor: theme.background,
                        },
                        style,
                    ]}
                >
                    <ThemedView style={styles.header}>
                        <ThemedText
                            style={[
                                styles.name,
                                {
                                    color: theme.text,
                                },
                            ]}
                        >
                            {first_name} {last_name}
                        </ThemedText>
                    </ThemedView>

                    <ThemedText
                        style={[
                            styles.topic,
                            {
                                color: theme.text,
                            },
                        ]}
                        numberOfLines={2}
                    >
                        {topic}
                    </ThemedText>

                    {!!topic_description && (
                        <ThemedText
                            style={[
                                styles.description,
                                {
                                    color: theme.text,
                                },
                            ]}
                            numberOfLines={3}
                        >
                            {topic_description}
                        </ThemedText>
                    )}
                </ThemedView>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        borderRadius: 10,
        borderWidth: 2,
        gap: 8,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
    },

    name: {
        fontSize: 16,
        fontWeight: "700",
        flexShrink: 1,
    },

    topic: {
        fontSize: 14,
        fontWeight: "600",
    },

    description: {
        fontSize: 13,
        opacity: 0.85,
    },
});
