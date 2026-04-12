import { useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";

import ThemedButton from "@/components/buttons/themed-button";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
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
            <View style={styles.container}>
                <Text style={styles.title}>Check your email</Text>

                <Text style={styles.description}>
                    We’ve sent a password reset link to {email}. Please check your inbox and follow the instructions.
                </Text>
            </View>
        );
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Forgot Password</Text>

                <Text style={styles.description}>Enter your email and we’ll send you a reset link.</Text>

                <ThemedTextInput
                    label="Email"
                    placeholder="Enter your email"
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
                    <ThemedButton title="Send reset link" onPress={sendResetLink} />
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
