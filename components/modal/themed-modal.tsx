import ThemedButton from "@/components/buttons/themed-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import React from "react";
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";

interface ThemedModalProps {
    visible: boolean;
    title?: string;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ThemedModal({ visible, title, onClose, children }: ThemedModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={styles.backdrop} onPress={onClose} />

            <View style={styles.center}>
                <ThemedView style={styles.modal}>
                    <View style={styles.header}>
                        <ThemedText style={styles.title}>{title ?? "Modal"}</ThemedText>

                        <Pressable onPress={onClose}>
                            <ThemedText style={styles.close}>✕</ThemedText>
                        </Pressable>
                    </View>

                    <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 20 }}>
                        {children}
                    </ScrollView>

                    <View style={styles.footer}>
                        <ThemedButton title="Close" onPress={onClose} />
                    </View>
                </ThemedView>
            </View>
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
        backgroundColor: "rgba(0,0,0,0.4)",
    },

    center: {
        flex: 1,
        justifyContent: "flex-end",
    },

    modal: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        minHeight: 300,
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },

    title: {
        fontSize: 18,
        fontWeight: "600",
    },

    close: {
        fontSize: 20,
    },

    content: {
        flex: 1,
    },

    footer: {
        marginTop: 10,
    },
});
