import { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";

import ThemedButton from "@/components/buttons/themed-button";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ChangePassword() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();

            const session = data.session;

            if (!session) {
                router.replace("/login");
                return;
            }

            setSessionChecked(true);
        };

        checkSession();
    }, []);

    async function handleChangePassword() {
        setError(null);

        if (!password || !confirmPassword) {
            setError("Password cannot be empty.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password,
        });

        setLoading(false);

        if (error) {
            setError(error.message);
            return;
        }

        setSuccess(true);
    }

    if (!sessionChecked) {
        return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: "center" }} />;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <Text style={styles.title}>Change Password</Text>

                <Text style={styles.description}>Enter your new password below.</Text>

                <ThemedTextInput
                    label="New Password"
                    placeholder="New password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    error={error ?? undefined}
                    style={styles.input}
                />

                <ThemedTextInput
                    label="Confirm Password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    error={error ?? undefined}
                    style={styles.input}
                />

                {loading ? (
                    <ActivityIndicator size="large" />
                ) : (
                    <ThemedButton
                        title={success ? "Password updated!" : "Update password"}
                        onPress={handleChangePassword}
                    />
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
    description: {
        fontSize: 16,
    },
    input: {
        padding: 10,
    },
});
