import { ThemedText } from "@/components/text/themed-text";
import { Colors, Fonts } from "@/constants/theme";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedView } from "../view/themed-view";

type Props = {
    title: string;
    description: string;
};

export function ThemedCard({ title, description }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const translateY = useRef(new Animated.Value(0)).current;

    const hoverIn = () => {
        Animated.spring(translateY, {
            toValue: -3,
            useNativeDriver: true,
            friction: 8,
        }).start();
    };

    const hoverOut = () => {
        Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
        }).start();
    };

    return (
        <Pressable onHoverIn={hoverIn} onHoverOut={hoverOut} onPressIn={hoverIn} onPressOut={hoverOut}>
            <Animated.View
                style={{
                    transform: [
                        {
                            translateY,
                        },
                    ],
                }}
            >
                <ThemedView
                    style={[
                        styles.card,
                        {
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                            shadowColor: theme.shadow,
                        },
                    ]}
                >
                    <ThemedText
                        style={[
                            styles.title,
                            {
                                color: theme.primary,
                            },
                        ]}
                    >
                        {title}
                    </ThemedText>

                    <ThemedText
                        style={[
                            styles.desc,
                            {
                                color: theme.textSecondary,
                            },
                        ]}
                    >
                        {description}
                    </ThemedText>
                </ThemedView>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,
        width: "100%",

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.08,
        shadowRadius: 16,

        elevation: 3,
    },

    title: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 18,
        lineHeight: 24,
        marginBottom: 8,
    },

    desc: {
        fontFamily: Fonts.sans,
        fontSize: 14,
        lineHeight: 22,
    },
});
