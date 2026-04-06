import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { useState } from "react";

import ThemedButton from "@/components/buttons/themed-button";
import { supabase } from "@/lib/supabase";
import { Link } from "@react-navigation/native";

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

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.mainContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ThemedView style={styles.container}>
                    <ThemedText type="title" style={styles.title}>
                        Login
                    </ThemedText>
                    <ThemedTextInput
                        label="Email"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        error={error}
                        style={styles.input}
                    />
                    <ThemedTextInput
                        label="Password"
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        keyboardType="default"
                        error={error}
                        secureTextEntry={true}
                        style={styles.input}
                    />
                    <ThemedView style={styles.register}>
                        <ThemedText>Does not have an account ?</ThemedText>
                        <Link screen="register" params={{ id: "" }}>
                            Click here !
                        </Link>
                    </ThemedView>
                    <ThemedButton title={"Sign in"} onPress={signIn}></ThemedButton>
                </ThemedView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        padding: 10,
        gap: 10,
    },
    register: {
        alignContent: "center",
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    input: {},
    title: {
        alignSelf: "center",
    },
});
