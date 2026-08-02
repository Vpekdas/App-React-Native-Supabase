import ThemedButton from "@/components/buttons/themed-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, Pressable, StyleSheet, useColorScheme } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ChangePassword() {
    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();

            if (!data.session) {
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
            setError("Le mot de passe ne peut pas être vide.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
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
        return <ActivityIndicator size="large" style={styles.loader} color={colors.accent} />;
    }

    return (
        <Pressable style={styles.flex} onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={[
                    styles.container,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedView style={styles.header}>
                    <ThemedText
                        style={[
                            styles.title,
                            {
                                color: colors.primary,
                            },
                        ]}
                    >
                        Modifier le mot de passe
                    </ThemedText>

                    <ThemedText
                        style={[
                            styles.description,
                            {
                                color: colors.textSecondary,
                            },
                        ]}
                    >
                        Saisissez votre nouveau mot de passe ci-dessous.
                    </ThemedText>
                </ThemedView>

                <ThemedView style={styles.form}>
                    <ThemedTextInput
                        label="Nouveau mot de passe"
                        placeholder="Nouveau mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={error ?? undefined}
                        style={styles.input}
                    />

                    <ThemedTextInput
                        label="Confirmer le mot de passe"
                        placeholder="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        error={error ?? undefined}
                        style={styles.input}
                    />

                    {loading ? (
                        <ActivityIndicator size="large" color={colors.accent} />
                    ) : (
                        <ThemedButton
                            title={success ? "Mot de passe mis à jour !" : "Mettre à jour le mot de passe"}
                            onPress={handleChangePassword}
                        />
                    )}

                    {success && (
                        <ThemedText
                            style={[
                                styles.success,
                                {
                                    color: colors.success,
                                },
                            ]}
                        >
                            Votre mot de passe a été mis à jour avec succès.
                        </ThemedText>
                    )}
                </ThemedView>
            </KeyboardAwareScrollView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },

    loader: {
        flex: 1,
        justifyContent: "center",
    },

    container: {
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingVertical: 40,
    },

    header: {
        marginBottom: 32,
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 36,
        lineHeight: 44,
        marginBottom: 8,
    },

    description: {
        fontFamily: Fonts.sans,
        fontSize: 16,
        lineHeight: 24,
    },

    form: {
        gap: 16,
    },

    input: {
        padding: 10,
    },

    success: {
        fontFamily: Fonts.sansMedium,
        fontSize: 15,
        textAlign: "center",
        marginTop: 8,
    },
});
