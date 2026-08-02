import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

export default function VerifyMail() {
    const [isLoading] = useState(true);

    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <Ionicons name="mail-open-outline" size={72} color={colors.accent} style={styles.icon} />

            <ThemedText
                style={[
                    styles.title,
                    {
                        color: colors.primary,
                    },
                ]}
            >
                Vérifiez votre e-mail
            </ThemedText>

            <ThemedText
                style={[
                    styles.description,
                    {
                        color: colors.textSecondary,
                    },
                ]}
            >
                Nous avons envoyé un e-mail de confirmation dans votre boîte de réception. Cliquez sur le lien de
                vérification pour activer votre compte. Une fois vérifié, vous serez automatiquement redirigé.
            </ThemedText>

            {isLoading && <ActivityIndicator size="large" color={colors.accent} style={styles.loader} />}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
    },

    icon: {
        marginBottom: 28,
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 34,
        textAlign: "center",
        marginBottom: 16,
    },

    description: {
        fontFamily: Fonts.sans,
        fontSize: 17,
        lineHeight: 28,
        textAlign: "center",
        maxWidth: 340,
    },

    loader: {
        marginTop: 40,
    },
});
