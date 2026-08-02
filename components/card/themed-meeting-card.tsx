import { Colors, Fonts } from "@/constants/theme";
import { useRef } from "react";
import { Animated, Linking, Pressable, StyleSheet, useColorScheme } from "react-native";

import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

export type MeetingCardProps = {
    topic: string;
    studentName: string;
    startsAt: string;
    endsAt: string;
    roomName: string;
};

export default function ThemedMeetingCard({ topic, studentName, startsAt, endsAt, roomName }: MeetingCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const scale = useRef(new Animated.Value(1)).current;

    const meetingUrl = `https://meet.jit.si/${roomName}`;

    const joinMeeting = async () => {
        const supported = await Linking.canOpenURL(meetingUrl);

        if (supported) {
            await Linking.openURL(meetingUrl);
        }
    };

    const animateIn = () => {
        Animated.spring(scale, {
            toValue: 0.98,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    const animateOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            friction: 5,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable onPressIn={animateIn} onPressOut={animateOut} onHoverIn={animateIn} onHoverOut={animateOut}>
            <Animated.View
                style={[
                    styles.container,
                    {
                        backgroundColor: theme.surface,
                        borderColor: theme.border,
                        shadowColor: theme.shadow,
                        transform: [{ scale }],
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

                <ThemedView
                    style={[
                        styles.divider,
                        {
                            backgroundColor: theme.border,
                        },
                    ]}
                />

                <ThemedText
                    style={[
                        styles.label,
                        {
                            color: theme.textSecondary,
                        },
                    ]}
                >
                    Étudiant
                </ThemedText>

                <ThemedText
                    style={[
                        styles.value,
                        {
                            color: theme.text,
                        },
                    ]}
                >
                    {studentName}
                </ThemedText>

                <ThemedView style={styles.timeRow}>
                    <ThemedView>
                        <ThemedText
                            style={[
                                styles.label,
                                {
                                    color: theme.textSecondary,
                                },
                            ]}
                        >
                            Début
                        </ThemedText>

                        <ThemedText
                            style={[
                                styles.value,
                                {
                                    color: theme.text,
                                },
                            ]}
                        >
                            {new Date(startsAt).toLocaleString()}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView>
                        <ThemedText
                            style={[
                                styles.label,
                                {
                                    color: theme.textSecondary,
                                },
                            ]}
                        >
                            Fin
                        </ThemedText>

                        <ThemedText
                            style={[
                                styles.value,
                                {
                                    color: theme.text,
                                },
                            ]}
                        >
                            {new Date(endsAt).toLocaleString()}
                        </ThemedText>
                    </ThemedView>
                </ThemedView>

                <Pressable
                    onPress={joinMeeting}
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: theme.accent,
                        },
                        pressed && styles.buttonPressed,
                    ]}
                >
                    <ThemedText
                        style={[
                            styles.buttonText,
                            {
                                color: "#FFFFFF",
                            },
                        ]}
                    >
                        Rejoindre la réunion →
                    </ThemedText>
                </Pressable>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 18,
        borderWidth: 1,

        shadowOffset: {
            width: 0,
            height: 8,
        },

        shadowOpacity: 0.08,
        shadowRadius: 16,

        elevation: 3,
    },

    topic: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 20,
        lineHeight: 26,
        marginBottom: 14,
    },

    divider: {
        height: 1,
        marginBottom: 16,
    },

    label: {
        fontFamily: Fonts.sans,
        fontSize: 13,
        marginBottom: 4,
    },

    value: {
        fontFamily: Fonts.sansMedium,
        fontSize: 15,
        marginBottom: 12,
    },

    timeRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
    },

    button: {
        marginTop: 18,
        paddingVertical: 13,
        borderRadius: 14,
        alignItems: "center",
    },

    buttonPressed: {
        opacity: 0.85,
        transform: [
            {
                scale: 0.96,
            },
        ],
    },

    buttonText: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 15,
    },
});
