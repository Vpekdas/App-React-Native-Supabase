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
import { ThemedView } from "@/components/themed-view";
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

    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        topic?: string;
        topicDescription?: string;
    }>({});

    async function signUpNewUser() {
        setErrors({});
        const newErrors: typeof errors = {};

        const topicValue = topic.trim();

        if (!firstName) newErrors.firstName = "First name cannot be empty";
        if (!lastName) newErrors.lastName = "Last name cannot be empty";
        if (!email) newErrors.email = "Email cannot be empty";
        if (!topicValue) newErrors.topic = "Topic cannot be empty";
        if (!password) newErrors.password = "Password cannot be empty";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const redirectTo = makeRedirectUri({ scheme: "App-React-Native-Supabase", path: "auth" });

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: redirectTo,
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    education_year: Number(educationYear),
                    user_type: userType,
                    topic: topicValue,
                    topic_description: topicDescription,
                },
            },
        });

        if (error) {
            console.log(error.message);
            return;
        }

        router.push("/verify-email");
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

                    <ThemedPicker
                        label="User Type"
                        selectedValue={userType}
                        onValueChange={(itemValue) => setUserType(itemValue as string)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Student" value="student" />
                        <Picker.Item label="Chartered Accountant" value="chartered_accountant" />
                    </ThemedPicker>

                    {userType === "student" && (
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
                    )}

                    <ThemedTextInput
                        label="Topic"
                        placeholder="Topic + keyword"
                        value={topic}
                        onChangeText={setTopic}
                        error={errors.topic}
                        style={styles.input}
                        textContentType="none"
                        importantForAutofill="no"
                    />

                    <ThemedTextInput
                        label="Topic description"
                        placeholder="Topic description"
                        value={topicDescription}
                        onChangeText={setTopicDescription}
                        error={errors.topicDescription}
                        style={styles.input}
                        textContentType="none"
                        importantForAutofill="no"
                    />

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

                    <ThemedButton style={styles.button} title="Sign up" onPress={signUpNewUser} />
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
        flex: 1,
    },
    inputContainer: {
        marginTop: 20,
        justifyContent: "center",
        flexDirection: "column",
        borderRadius: 20,
        padding: 10,
        width: "30%",
    },
    input: {
        marginBottom: 12,
        padding: 10,
        flex: 1,
    },
    picker: {
        marginBottom: 12,
    },
    title: {
        alignSelf: "center",
    },
    button: {
        marginTop: 10,
    },
});
