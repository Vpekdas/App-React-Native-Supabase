import ThemedButton from "@/components/buttons/themed-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import type React from "react";
import { useEffect, useRef } from "react";
import { Animated, Easing, Modal, Platform, Pressable, ScrollView, StyleSheet, useColorScheme } from "react-native";

interface ThemedModalProps {
    visible: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ThemedModal({ visible, title, onClose, children }: ThemedModalProps) {
    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const translateY = useRef(new Animated.Value(300)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.spring(translateY, {
                    toValue: 0,
                    damping: 18,
                    stiffness: 150,
                    mass: 0.8,
                    useNativeDriver: true,
                }),

                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 220,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            translateY.setValue(300);
            opacity.setValue(0);
        }
    }, [visible, translateY, opacity]);

    return (
        <Modal visible={visible} transparent onRequestClose={onClose}>
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity,
                    },
                ]}
            >
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>

            <ThemedView style={styles.center}>
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
                            styles.modal,
                            {
                                backgroundColor: theme.surface,
                                shadowColor: theme.shadow,
                            },
                        ]}
                    >
                        <ThemedView style={styles.handle} />

                        <ThemedView style={styles.header}>
                            <ThemedText
                                style={[
                                    styles.title,
                                    {
                                        color: theme.primary,
                                    },
                                ]}
                            >
                                {title ?? "Fenêtre"}
                            </ThemedText>

                            <Pressable onPress={onClose} hitSlop={10}>
                                <ThemedText
                                    style={[
                                        styles.close,
                                        {
                                            color: theme.textMuted,
                                        },
                                    ]}
                                >
                                    ✕
                                </ThemedText>
                            </Pressable>
                        </ThemedView>

                        <ScrollView
                            style={styles.content}
                            contentContainerStyle={styles.contentContainer}
                            showsVerticalScrollIndicator={false}
                        >
                            {children}
                        </ScrollView>

                        <ThemedView
                            style={[
                                styles.footer,
                                {
                                    borderTopColor: theme.border,
                                },
                            ]}
                        >
                            <ThemedButton title="Fermer" onPress={onClose} />
                        </ThemedView>
                    </ThemedView>
                </Animated.View>
            </ThemedView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(7,26,19,0.45)",
    },

    center: {
        flex: 1,
        justifyContent: "flex-end",
    },

    modal: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 24,
        minHeight: 320,

        ...Platform.select({
            ios: {
                shadowOffset: {
                    width: 0,
                    height: -5,
                },
                shadowOpacity: 0.15,
                shadowRadius: 20,
            },

            android: {
                elevation: 12,
            },
        }),
    },

    handle: {
        alignSelf: "center",
        width: 44,
        height: 5,
        borderRadius: 10,
        backgroundColor: "#93A09A",
        marginBottom: 20,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 26,
        lineHeight: 34,
    },

    close: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 20,
    },

    content: {
        flexGrow: 1,
    },

    contentContainer: {
        paddingBottom: 20,
    },

    footer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
    },
});
