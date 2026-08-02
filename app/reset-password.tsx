import { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, StyleSheet, Text, TouchableWithoutFeedback } from "react-native";

import { supabase } from "@/lib/supabase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ThemedText } from "@/components/text/themed-text";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function ResetPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const url = Linking.useLinkingURL();

    const createSessionFromUrl = async (url: string) => {
        const { params, errorCode } = QueryParams.getQueryParams(url);

        if (errorCode) throw new Error(errorCode);

        let access_token = params?.access_token;
        let refresh_token = params?.refresh_token;

        if (!access_token) {
            const hash = url.split("#")[1];

            if (hash) {
                const hashParams = Object.fromEntries(hash.split("&").map((p) => p.split("=")));

                access_token = hashParams.access_token;
                refresh_token = hashParams.refresh_token;
            }
        }

        if (!access_token) {
            return null;
        }

        const { data, error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        });

        if (error) throw error;

        return data.session;
    };

    useEffect(() => {
        if (!url) return;

        createSessionFromUrl(url)
            .then((session) => {
                if (session) {
                    router.replace("/change-password");
                }
            })
            .catch(() => {
                setError("Le lien de réinitialisation est invalide ou expiré.");
            });
    }, [url]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedText style={styles.title}>Réinitialiser le mot de passe</ThemedText>
                <ThemedText style={styles.description}>Préparation de la session sécurisée...</ThemedText>

                {loading && <ActivityIndicator size="large" />}

                {error && <Text style={{ color: "red" }}>{error}</Text>}
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
});
