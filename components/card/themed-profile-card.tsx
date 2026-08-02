import { Colors, Fonts } from "@/constants/theme";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

export type ProfileProps = {
    topic: string;
    description: string;
    onPress?: () => void;
};

export default function ThemedProfileCard({ topic, description, onPress }: ProfileProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const scale = useRef(new Animated.Value(1)).current;
    const shadow = useRef(new Animated.Value(0)).current;

    const animateIn = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1.02,
                useNativeDriver: true,
                friction: 6,
            }),

            Animated.timing(shadow, {
                toValue: 1,
                duration: 180,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const animateOut = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                useNativeDriver: true,
                friction: 6,
            }),

            Animated.timing(shadow, {
                toValue: 0,
                duration: 180,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const shadowOpacity = shadow.interpolate({
        inputRange: [0, 1],
        outputRange: [0.08, 0.18],
    });

    return (
        <Pressable
            onPress={onPress}
            onHoverIn={animateIn}
            onHoverOut={animateOut}
            onPressIn={animateIn}
            onPressOut={animateOut}
            style={styles.pressable}
        >
            <Animated.View
                style={{
                    transform: [{ scale }],
                }}
            >
                <ThemedView
                    style={[
                        styles.container,
                        {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                            shadowColor: theme.shadow,
                            shadowOpacity,
                        },
                    ]}
                >
                    <ThemedText
                        style={[
                            styles.topic,
                            {
                                color: theme.primary,
                            },
                        ]}
                    >
                        {topic}
                    </ThemedText>

                    <ThemedText
                        style={[
                            styles.description,
                            {
                                color: theme.textSecondary,
                            },
                        ]}
                    >
                        {description}
                    </ThemedText>

                    <ThemedText
                        style={[
                            styles.action,
                            {
                                color: theme.accent,
                            },
                        ]}
                    >
                        Voir les disponibilités →
                    </ThemedText>
                </ThemedView>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: "100%",
    },

    container: {
        width: "100%",
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowRadius: 16,

        elevation: 3,
    },

    topic: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 20,
        lineHeight: 26,
        marginBottom: 8,
    },

    description: {
        fontFamily: Fonts.sans,
        fontSize: 15,
        lineHeight: 23,
        marginBottom: 16,
    },

    action: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 14,
    },
});
