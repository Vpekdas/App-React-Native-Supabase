import ThemedButton from "@/components/buttons/themed-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import { useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function sendResetLink() {
        setIsLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: makeRedirectUri({
                scheme: "App-React-Native-Supabase",
                path: "reset-password",
            }),
        });

        setIsLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setSent(true);
    }

    if (sent) {
        return (
            <ThemedView style={styles.container}>
                <ThemedText style={styles.title}>Vérifiez votre e-mail</ThemedText>
                <ThemedText style={styles.description}>
                    Nous vous avons envoyé un lien de réinitialisation du mot de passe par e-mail. Consultez votre boîte
                    de réception et suivez les instructions.
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedText style={styles.title}>Mot de passe oublié</ThemedText>

                <ThemedText style={styles.description}>
                    Entrez votre e-mail et nous vous enverrons un lien de réinitialisation.
                </ThemedText>

                <ThemedTextInput
                    label="E-mail"
                    placeholder="Entrez votre e-mail"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={error ?? undefined}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                {isLoading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <ThemedButton title="Envoyer le lien de réinitialisation" onPress={sendResetLink} />
                )}
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        justifyContent: "center",
        gap: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    input: {
        padding: 10,
    },
    description: {
        fontSize: 16,
    },
});
