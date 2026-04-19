import { Colors } from "@/constants/theme";
import React from "react";
import { Pressable, StyleSheet, useColorScheme, ViewStyle } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../themed-view";

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

    return (
        <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => pressed && styles.pressed}>
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
                    <ThemedText style={[styles.name, { color: theme.text }]}>
                        {first_name} {last_name}
                    </ThemedText>
                </ThemedView>

                <ThemedText style={[styles.topic, { color: theme.text }]} numberOfLines={2}>
                    {topic}
                </ThemedText>

                {!!topic_description && (
                    <ThemedText style={[styles.description, { color: theme.text }]} numberOfLines={3}>
                        {topic_description}
                    </ThemedText>
                )}
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressed: {
        opacity: 0.85,
    },
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
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 999,
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "700",
    },
});
