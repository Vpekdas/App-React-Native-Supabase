import { Link } from "expo-router";
import { useState } from "react";
import {
    Keyboard,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    useColorScheme,
    useWindowDimensions,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Background from "@/components/background";
import ThemedButton from "@/components/buttons/themed-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { supabase } from "@/lib/supabase";

export default function Login() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));
    const cardWidth = Math.min(520, width - horizontal * 2);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | undefined>();

    async function signIn() {
        setError(undefined);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        }
    }

    const content = (
        <Background>
            <KeyboardAwareScrollView
                contentContainerStyle={[
                    styles.container,
                    { paddingHorizontal: horizontal, backgroundColor: theme.background },
                ]}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedView
                    style={[
                        styles.card,
                        { width: cardWidth, backgroundColor: theme.surface, borderColor: theme.border },
                    ]}
                >
                    <ThemedText style={[styles.title, { color: theme.text }]}>Connexion</ThemedText>
                    <ThemedTextInput
                        label="E-mail"
                        placeholder="E-mail"
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
                        label="Mot de passe"
                        placeholder="Mot de passe"
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
                    <ThemedView style={styles.row}>
                        <ThemedText style={[styles.rowText, { color: theme.textSecondary }]}>
                            Vous n'avez pas de compte ?{" "}
                        </ThemedText>
                        <Link href="/register">
                            <ThemedText style={[styles.link, { color: theme.accent }]}>Cliquez ici !</ThemedText>
                        </Link>
                    </ThemedView>
                    <ThemedView style={styles.row}>
                        <ThemedText style={[styles.rowText, { color: theme.textSecondary }]}>
                            Mot de passe oublié ?{" "}
                        </ThemedText>
                        <Link href="/forgot-password">
                            <ThemedText style={[styles.link, { color: theme.accent }]}>
                                Réinitialiser le mot de passe
                            </ThemedText>
                        </Link>
                    </ThemedView>
                    <ThemedButton style={styles.button} title="Se connecter" onPress={signIn} />{" "}
                </ThemedView>
            </KeyboardAwareScrollView>
        </Background>
    );

    if (Platform.OS === "web") return content;
    return <TouchableWithoutFeedback onPress={Keyboard.dismiss}>{content}</TouchableWithoutFeedback>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },

    card: {
        borderWidth: 1,
        borderRadius: 22,
        paddingVertical: 28,
        paddingHorizontal: 22,
    },

    title: {
        ...Typography.h2,
        fontSize: 34,
        lineHeight: 40,
        marginBottom: 18,
        textAlign: "center",
        includeFontPadding: false,
    },

    input: {
        marginBottom: 12,
    },

    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        flexWrap: "wrap",
        gap: 2,
    },

    rowText: {
        ...Typography.body,
        includeFontPadding: false,
    },

    link: {
        ...Typography.bodyMedium,
        includeFontPadding: false,
    },

    button: {
        marginTop: 14,
    },
});
