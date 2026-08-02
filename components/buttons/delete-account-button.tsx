import { Colors, Fonts } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { Alert, Platform, Pressable, StyleSheet, useColorScheme } from "react-native";

import { router } from "expo-router";
import { useState } from "react";
import { ThemedText } from "../text/themed-text";

export default function DeleteAccountButton() {
    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    const [hovered, setHovered] = useState(false);

    const deleteAccount = () => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm(
                "Cette action supprimera définitivement votre compte ainsi que toutes les données associées, y compris votre CV et vos rendez-vous.",
            );

            if (confirmed) {
                executeDelete();
            }

            return;
        }

        Alert.alert(
            "Supprimer le compte",
            "Cette action supprimera définitivement votre compte ainsi que toutes les données associées, y compris votre CV et vos rendez-vous.",
            [
                {
                    text: "Annuler",
                    style: "cancel",
                },
                {
                    text: "Supprimer",
                    style: "destructive",
                    onPress: executeDelete,
                },
            ],
        );
    };

    const executeDelete = async () => {
        const { error } = await supabase.functions.invoke("delete-account");

        if (error) {
            Alert.alert("Erreur", error.message);
            return;
        }

        await supabase.auth.signOut();

        Alert.alert("Compte supprimé", "Votre compte a été définitivement supprimé.");

        router.replace("/login");
    };

    return (
        <Pressable
            onPress={deleteAccount}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            style={({ pressed }) => [
                styles.container,
                {
                    borderColor: colors.destructive,
                    backgroundColor: hovered
                        ? colorScheme === "dark"
                            ? "rgba(255,80,80,0.22)"
                            : "rgba(255,80,80,0.14)"
                        : colorScheme === "dark"
                          ? "rgba(255,80,80,0.12)"
                          : "rgba(255,80,80,0.08)",
                    opacity: pressed ? 0.75 : 1,
                    transform: [
                        {
                            scale: pressed ? 0.97 : hovered ? 1.01 : 1,
                        },
                    ],
                },
            ]}
        >
            <ThemedText
                style={[
                    styles.text,
                    {
                        color: colors.destructive,
                    },
                ]}
            >
                Supprimer le compte
            </ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        paddingVertical: 14,
        borderWidth: 1,
        borderRadius: 14,
        alignItems: "center",
        marginTop: 16,
    },

    text: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 16,
    },
});
