import { Picker } from "@react-native-picker/picker";
import { makeRedirectUri } from "expo-auth-session";
import { router } from "expo-router";
import { useState } from "react";
import { Keyboard, Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import Background from "@/components/background";
import ThemedButton from "@/components/buttons/themed-button";
import { ThemedPicker } from "@/components/picker/themed-picker";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { supabase } from "@/lib/supabase";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [educationYear, setEducationYear] = useState("1");
    const [userType, setUserType] = useState("student");
    const [topic, setTopic] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [supra, setSupra] = useState("0");

    const [errors, setErrors] = useState<any>({});

    async function signUpNewUser() {
        setErrors({});
        const newErrors: any = {};

        if (!firstName) newErrors.firstName = "First name cannot be empty";
        if (!lastName) newErrors.lastName = "Last name cannot be empty";
        if (!email) newErrors.email = "Email cannot be empty";
        if (!topic) newErrors.topic = "Topic cannot be empty";
        if (!password) newErrors.password = "Password cannot be empty";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        if (!supra) newErrors.supraNumber = "Supra number cannot be empty";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const redirectTo = makeRedirectUri({
            scheme: "App-React-Native-Supabase",
            path: "auth",
        });

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    education_year: Number(educationYear),
                    user_type: userType,
                    topic: topic.trim(),
                    topic_description: topicDescription,
                    supra: supra,
                },
            },
        });

        if (error) {
            return;
        }

        router.replace("/verify-email");
    }

    const content = (
        <Background>
            <KeyboardAwareScrollView
                contentContainerStyle={styles.container}
                enableOnAndroid
                keyboardShouldPersistTaps="handled"
            >
                <ThemedView style={styles.inputContainer}>
                    <ThemedTextInput
                        label="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                        error={errors.firstName}
                    />

                    <ThemedTextInput
                        label="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                        error={errors.lastName}
                    />

                    <ThemedTextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        error={errors.email}
                    />

                    <ThemedPicker
                        label="User Type"
                        selectedValue={userType}
                        onValueChange={(v) => setUserType(String(v))}
                    >
                        <Picker.Item label="Student" value="student" />
                        <Picker.Item label="Chartered Accountant" value="chartered_accountant" />
                    </ThemedPicker>

                    {userType === "student" && (
                        <ThemedPicker
                            label="Education Year"
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
                            label="Supra number"
                            value={supra}
                            onChangeText={setSupra}
                            error={errors.supraNumber}
                        />
                    )}

                    <ThemedTextInput label="Topic" value={topic} onChangeText={setTopic} error={errors.topic} />

                    <ThemedTextInput
                        label="Topic Description"
                        value={topicDescription}
                        onChangeText={setTopicDescription}
                    />

                    <ThemedTextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        error={errors.password}
                    />

                    <ThemedTextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                        error={errors.confirmPassword}
                    />

                    <ThemedButton title="Sign up" onPress={signUpNewUser} />
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
    },
    inputContainer: {
        width: "30%",
        padding: 10,
        borderRadius: 20,
        gap: 10,
    },
});
