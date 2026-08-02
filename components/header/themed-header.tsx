import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Animated, Image, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemedButton from "../buttons/themed-button";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

type ThemedHeaderProps = {
    onNavigate: (id: string) => void;
};

type NavItemProps = {
    label: string;
    color: string;
    onPress: () => void;
};

export default function ThemedHeader({ onNavigate }: ThemedHeaderProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));
    const isMobile = width <= 960;

    return (
        <SafeAreaView edges={["top"]} style={{ backgroundColor: theme.background }}>
            <ThemedView
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.background,
                        borderBottomColor: theme.border,
                        paddingHorizontal: horizontal,
                    },
                ]}
            >
                <ThemedView style={styles.inner}>
                    <ThemedView style={styles.site}>
                        <Image source={require("@/assets/images/icon.png")} style={styles.logo} />

                        <ThemedView style={styles.textContainer}>
                            <ThemedText style={[styles.name, { color: theme.text }]}>App-React-Native-Supabase</ThemedText>

                            <ThemedText style={[styles.description, { color: theme.textMuted }]}>
                                Retours d’expérience par sujet
                            </ThemedText>
                        </ThemedView>
                    </ThemedView>

                    {!isMobile && (
                        <ThemedView style={styles.nav}>
                            <NavItem
                                label="Fonctionnalités"
                                onPress={() => onNavigate("Fonctionnalités")}
                                color={theme.textSecondary}
                            />

                            <NavItem
                                label="Pourquoi App-React-Native-Supabase"
                                onPress={() => onNavigate("Pourquoi App-React-Native-Supabase")}
                                color={theme.textSecondary}
                            />

                            <NavItem
                                label="Comment ça marche"
                                onPress={() => onNavigate("Comment ça marche")}
                                color={theme.textSecondary}
                            />
                        </ThemedView>
                    )}

                    <ThemedButton
                        title="Se connecter"
                        onPress={() => {
                            router.push("/login");
                        }}
                    />
                </ThemedView>

                {isMobile && (
                    <ThemedView style={styles.navMobile}>
                        <NavItem
                            label="Fonctionnalités"
                            onPress={() => onNavigate("Fonctionnalités")}
                            color={theme.textSecondary}
                        />

                        <NavItem
                            label="Pourquoi App-React-Native-Supabase"
                            onPress={() => onNavigate("Pourquoi App-React-Native-Supabase")}
                            color={theme.textSecondary}
                        />

                        <NavItem
                            label="Comment ça marche"
                            onPress={() => onNavigate("Comment ça marche")}
                            color={theme.textSecondary}
                        />
                    </ThemedView>
                )}
            </ThemedView>
        </SafeAreaView>
    );
}

function NavItem({ label, color, onPress }: NavItemProps) {
    const hover = useRef(new Animated.Value(0)).current;

    const animateIn = () => {
        Animated.timing(hover, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    const animateOut = () => {
        Animated.timing(hover, {
            toValue: 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    };

    const backgroundColor = hover.interpolate({
        inputRange: [0, 1],
        outputRange: ["transparent", "rgba(0,0,0,0.06)"],
    });

    return (
        <Pressable
            onPress={onPress}
            onHoverIn={animateIn}
            onHoverOut={animateOut}
            onPressIn={animateIn}
            onPressOut={animateOut}
            style={styles.item}
        >
            <Animated.View
                style={[
                    styles.navHover,
                    {
                        backgroundColor,
                    },
                ]}
            >
                <ThemedText style={[styles.linkText, { color }]}>{label}</ThemedText>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingVertical: 10,
    },

    inner: {
        width: "100%",
        maxWidth: 1240,
        alignSelf: "center",
        minHeight: 56,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
    },

    site: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flexShrink: 1,
    },

    logo: {
        width: 32,
        height: 32,
        borderRadius: 9,
    },

    textContainer: {
        flexDirection: "column",
        justifyContent: "center",
    },

    name: {
        ...Typography.cardTitleSm,
        fontSize: 17,
        lineHeight: 20,
        letterSpacing: -0.4,
        includeFontPadding: false,
    },

    description: {
        ...Typography.heroNote,
        fontSize: 12,
        lineHeight: 14,
        includeFontPadding: false,
    },

    nav: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },

    navMobile: {
        marginTop: 10,
        width: "100%",
        maxWidth: 1240,
        alignSelf: "center",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },

    item: {
        borderRadius: 999,
    },

    navHover: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
    },

    linkText: {
        ...Typography.marqueeItem,
        fontSize: 13.5,
        lineHeight: 18,
        includeFontPadding: false,
    },
});
