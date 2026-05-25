import { Colors } from "@/constants/theme";
import { Modal, Pressable, ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

export type ThemedPopupProps = {
    visible: boolean;
    title: string;
    content: string;
    accepted: boolean;
    onToggleAccepted: () => void;
    onAccept: () => void;
};

export default function ThemedPopup({
    visible,
    title,
    content,
    accepted,
    onToggleAccepted,
    onAccept,
}: ThemedPopupProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <Modal visible={visible} transparent animationType="fade">
            <ThemedView
                style={[
                    styles.overlay,
                    {
                        backgroundColor: "rgba(0,0,0,0.5)",
                    },
                ]}
            >
                <ThemedView
                    style={[
                        styles.popup,
                        {
                            backgroundColor: theme.background,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <ThemedText style={styles.title}>{title}</ThemedText>

                    <ScrollView style={styles.contentContainer}>
                        <ThemedText style={styles.content}>{content}</ThemedText>
                    </ScrollView>

                    <Pressable onPress={onToggleAccepted} style={styles.checkboxRow}>
                        <View
                            style={[
                                styles.checkbox,
                                {
                                    borderColor: theme.border,
                                    backgroundColor: accepted ? theme.tint : "transparent",
                                },
                            ]}
                        />

                        <ThemedText>I accept the terms and conditions</ThemedText>
                    </Pressable>

                    <Pressable
                        disabled={!accepted}
                        onPress={onAccept}
                        style={[
                            styles.button,
                            {
                                backgroundColor: accepted ? theme.tint : theme.border,
                            },
                        ]}
                    >
                        <ThemedText style={styles.buttonText}>Accept</ThemedText>
                    </Pressable>
                </ThemedView>
            </ThemedView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },

    popup: {
        width: "100%",
        maxWidth: 500,
        borderRadius: 16,
        borderWidth: 1,
        padding: 20,
        maxHeight: "80%",
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 16,
    },

    contentContainer: {
        marginBottom: 20,
    },

    content: {
        fontSize: 15,
        lineHeight: 22,
    },

    checkboxRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        gap: 12,
    },

    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderRadius: 4,
    },

    button: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    buttonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
});
