import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import { ThemedView } from "../view/themed-view";

type Props = {
    href: any;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
};

export default function ThemedItem({ href, label, icon }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    const animateHover = (active: boolean) => {
        Animated.spring(translateY, {
            toValue: active ? -3 : 0,
            useNativeDriver: true,
            friction: 8,
        }).start();

        Animated.spring(scale, {
            toValue: active ? 1.01 : 1,
            useNativeDriver: true,
            friction: 8,
        }).start();
    };

    return (
        <Link href={href} asChild>
            <Pressable
                onHoverIn={() => animateHover(true)}
                onHoverOut={() => animateHover(false)}
                style={styles.wrapper}
            >
                <Animated.View
                    style={[
                        styles.container,
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
                    <ThemedView style={styles.item}>
                        <ThemedView
                            style={[
                                styles.iconContainer,
                                {
                                    backgroundColor: theme.mist,
                                },
                            ]}
                        >
                            <Ionicons name={icon} size={22} color={theme.accent} />
                        </ThemedView>

                        <ThemedText
                            style={[
                                styles.label,
                                {
                                    color: theme.text,
                                },
                            ]}
                        >
                            {label}
                        </ThemedText>

                        <Ionicons name="chevron-forward" size={20} color={theme.textMuted} />
                    </ThemedView>
                </Animated.View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: "100%",
    },

    container: {
        width: "100%",
        borderRadius: 18,
        borderWidth: 1,
        paddingHorizontal: 16,

        shadowOffset: {
            width: 0,
            height: 6,
        },

        shadowOpacity: 0.1,
        shadowRadius: 14,

        elevation: 3,
    },

    item: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 68,
        gap: 14,
    },

    iconContainer: {
        width: 42,
        height: 42,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
    },

    label: {
        flex: 1,
        fontFamily: Fonts.sansSemiBold,
        fontSize: 16,
    },
});
