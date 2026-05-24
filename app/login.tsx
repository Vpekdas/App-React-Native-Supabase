import { Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { useState } from "react";

import Background from "@/components/background";
import ThemedButton from "@/components/buttons/themed-button";
import { supabase } from "@/lib/supabase";
import { Link } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | undefined>();

    async function signIn() {
        setError(undefined);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            setError(error.message);
        }
    }

    const content = (
        <Background>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedText type="title" style={styles.title}>
                    Login
                </ThemedText>
                <ThemedView style={styles.inputContainer}>
                    <ThemedTextInput
                        label="Email"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        error={error}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                        textContentType="none"
                        importantForAutofill="no"
                    />

                    <ThemedTextInput
                        label="Password"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={error}
                        style={styles.input}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete="off"
                        textContentType="none"
                        importantForAutofill="no"
                    />

                    <ThemedView style={styles.register}>
                        <ThemedText>Does not have an account ? </ThemedText>
                        <Link href="/register">
                            <ThemedText style={{ color: "#0a7ea4" }}>Click here !</ThemedText>
                        </Link>
                    </ThemedView>

                    <ThemedView style={styles.register}>
                        <ThemedText>Forgot your password ? </ThemedText>
                        <Link href="/forgot-password">
                            <ThemedText style={{ color: "#0a7ea4" }}>Reset password</ThemedText>
                        </Link>
                    </ThemedView>

                    <ThemedButton style={styles.button} title="Sign in" onPress={signIn} />
                </ThemedView>
            </KeyboardAwareScrollView>
        </Background>
    );

    if (Platform.OS === "web") {
        return content;
    }

    return <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{content}</TouchableWithoutFeedback>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
    },

    inputContainer: {
        marginTop: 20,
        justifyContent: "center",
        flexDirection: "column",
        borderRadius: 20,
        padding: 10,
    },

    input: {
        marginBottom: 12,
        padding: 10,
    },

    register: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },

    title: {
        alignSelf: "center",
    },

    button: { marginTop: 10 },
});
