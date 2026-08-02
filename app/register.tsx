import { Picker } from "@react-native-picker/picker";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
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
import { ThemedPicker } from "@/components/picker/themed-picker";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { supabase } from "@/lib/supabase";

type FormErrors = {
    firstName?: string;
    lastName?: string;
    email?: string;
    topic?: string;
    password?: string;
    confirmPassword?: string;
    supraNumber?: string;
};

export default function Register() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];
    const { width } = useWindowDimensions();

    const horizontal = Math.min(64, Math.max(20, width * 0.05));
    const cardWidth = Math.min(560, width - horizontal * 2);

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [educationYear, setEducationYear] = useState("1");
    const [userType, setUserType] = useState("student");
    const [topic, setTopic] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [supra, setSupra] = useState("");

    const [errors, setErrors] = useState<FormErrors>({});

    async function signUpNewUser() {
        setErrors({});
        const newErrors: FormErrors = {};

        if (!firstName.trim()) newErrors.firstName = "Le prénom ne peut pas être vide";
        if (!lastName.trim()) newErrors.lastName = "Le nom ne peut pas être vide";
        if (!email.trim()) newErrors.email = "L'e-mail ne peut pas être vide";
        if (!topic.trim()) newErrors.topic = "Le sujet ne peut pas être vide";
        if (!password) newErrors.password = "Le mot de passe ne peut pas être vide";
        if (password !== confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
        if (userType === "chartered_accountant" && !supra.trim()) {
            newErrors.supraNumber = "Le numéro Supra ne peut pas être vide";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const redirectTo = makeRedirectUri({
            scheme: "App-React-Native-Supabase",
            path: "auth",
        });

        const { error } = await supabase.auth.signUp({
            email: email.trim(),
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: {
                    first_name: firstName.trim(),
                    last_name: lastName.trim(),
                    email: email.trim(),
                    education_year: Number(educationYear),
                    user_type: userType,
                    topic: topic.trim(),
                    topic_description: topicDescription.trim(),
                    supra: supra.trim(),
                },
            },
        });

        if (error) return;
        router.replace("/verify-email");
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
                        {
                            width: cardWidth,
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                        },
                    ]}
                >
                    <ThemedText style={[styles.title, { color: theme.text }]}>Créer un compte</ThemedText>
                    <ThemedTextInput
                        label="Prénom"
                        value={firstName}
                        onChangeText={setFirstName}
                        error={errors.firstName}
                    />
                    <ThemedTextInput label="Nom" value={lastName} onChangeText={setLastName} error={errors.lastName} />
                    <ThemedTextInput
                        label="E-mail"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        error={errors.email}
                        autoCapitalize="none"
                    />

                    <ThemedPicker
                        label="Type d'utilisateur"
                        selectedValue={userType}
                        onValueChange={(v) => setUserType(String(v))}
                    >
                        <Picker.Item label="Étudiant" value="student" />
                        <Picker.Item label="Expert-comptable diplômé" value="chartered_accountant" />
                    </ThemedPicker>

                    {userType === "student" && (
                        <ThemedPicker
                            label="Année d'études"
                            selectedValue={educationYear}
                            onValueChange={(v) => setEducationYear(String(v))}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                        </ThemedPicker>
                    )}

                    {userType === "chartered_accountant" && (
                        <ThemedTextInput
                            label="Numéro Supra"
                            value={supra}
                            onChangeText={setSupra}
                            error={errors.supraNumber}
                        />
                    )}

                    <ThemedTextInput label="Sujet" value={topic} onChangeText={setTopic} error={errors.topic} />
                    <ThemedTextInput
                        label="Description du sujet"
                        value={topicDescription}
                        onChangeText={setTopicDescription}
                    />

                    <ThemedTextInput
                        label="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password}
                    />

                    <ThemedTextInput
                        label="Confirmer le mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    <ThemedButton title="S'inscrire" onPress={signUpNewUser} style={styles.button} />
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
        paddingVertical: 24,
        paddingHorizontal: 18,
        gap: 10,
    },

    title: {
        ...Typography.h2,
        fontSize: 32,
        lineHeight: 38,
        marginBottom: 6,
        textAlign: "center",
        includeFontPadding: false,
    },

    button: {
        marginTop: 8,
    },
});
