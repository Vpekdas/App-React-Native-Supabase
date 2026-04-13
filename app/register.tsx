import { router } from "expo-router";
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

import { ThemedPicker } from "@/components/picker/themed-picker";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";

import ThemedButton from "@/components/buttons/themed-button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [educationYear, setEducationYear] = useState("1");
    const [userType, setUserType] = useState("student");
    const [theme, setTheme] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    }>({});

    async function signUpNewUser() {
        setErrors({});

        const newErrors: typeof errors = {};

        if (!firstName) newErrors.firstName = "First name cannot be empty";
        if (!lastName) newErrors.lastName = "Last name cannot be empty";
        if (!email) newErrors.email = "Email cannot be empty";
        if (!password) newErrors.password = "Password cannot be empty";
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const redirectTo = makeRedirectUri({
            scheme: "App-React-Native-Supabase",
            path: "auth",
        });

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    education_year: Number(educationYear),
                    user_type: userType,
                    theme: theme,
                },
            },
        });

        if (error) {
            console.log(error.message);
            return;
        }

        router.push("/verify-email");
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedText type="title" style={styles.title}>
                    Register
                </ThemedText>

                <ThemedTextInput
                    label="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    error={errors.firstName}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                <ThemedTextInput
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    error={errors.lastName}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                <ThemedTextInput
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={errors.email}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                <ThemedView style={{ marginBottom: 12 }}>
                    <ThemedPicker
                        label="User Type"
                        selectedValue={userType}
                        onValueChange={(itemValue) => setUserType(itemValue as string)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Student" value="student" />
                        <Picker.Item label="Chartered Accountant" value="chartered_accountant" />
                    </ThemedPicker>
                </ThemedView>

                {userType === "student" && (
                    <ThemedView style={{ marginBottom: 12 }}>
                        <ThemedPicker
                            label="Education Year"
                            selectedValue={educationYear}
                            onValueChange={(itemValue) => setEducationYear(itemValue as string)}
                            style={styles.picker}
                        >
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                        </ThemedPicker>
                    </ThemedView>
                )}

                {userType === "chartered_accountant" && (
                    <ThemedView style={{ marginBottom: 12 }}>
                        <ThemedPicker
                            label="Theme"
                            selectedValue={theme}
                            onValueChange={(itemValue) => setTheme(itemValue as string)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Audit" value="audit" />
                            <Picker.Item label="Comptabilite" value="comptabilite" />
                            <Picker.Item label="Management" value="management" />
                        </ThemedPicker>
                    </ThemedView>
                )}

                <ThemedTextInput
                    label="Password"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    error={errors.password}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                <ThemedTextInput
                    label="Confirm Password"
                    placeholder="Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    error={errors.confirmPassword}
                    style={styles.input}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="off"
                    textContentType="none"
                    importantForAutofill="no"
                />

                <ThemedButton title="Sign up" onPress={signUpNewUser} />
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },

    input: {
        marginBottom: 10,
        padding: 10,
    },

    picker: {
        marginBottom: 12,
    },

    title: {
        alignSelf: "center",
        marginBottom: 20,
    },
});
