import { router, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedTextInput } from "@/components/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";

import { supabase } from "@/lib/supabase";
import { makeRedirectUri } from "expo-auth-session";
import { Button } from "react-native";

export default function LoginScreen() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [educationYear, setEducationYear] = useState("");
    const [userType, setUserType] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | undefined>();

    async function signUpNewUser() {
        setError(undefined);

        const redirectTo = makeRedirectUri({
            scheme: "App-React-Native-Supabase",
            path: "/auth",
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
                },
            },
        });

        if (error) {
            setError(error.message);
            return;
        }

        router.push("/verify-email");
    }

    return (
        <>
            <Stack.Screen options={{ title: "Login" }} />
            <ThemedView style={styles.container}>
                <ThemedText type="title">Login</ThemedText>
                <ThemedTextInput
                    label="First Name"
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    keyboardType="default"
                    error={error}
                />
                <ThemedTextInput
                    label="Last Name"
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardType="default"
                    error={error}
                />
                <ThemedTextInput
                    label="Email"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={error}
                />
                <ThemedTextInput
                    label="Education Year"
                    placeholder="Education Year"
                    value={educationYear}
                    onChangeText={setEducationYear}
                    keyboardType="numeric"
                    error={error}
                />
                <Picker
                    selectedValue={userType}
                    onValueChange={(itemValue, itemIndex) => setUserType(itemValue)}
                    style={styles.picker}
                >
                    <Picker.Item label="Student" value="student" />
                    <Picker.Item label="Chartered Accountant" value="chartered_accountant" />
                </Picker>
                <ThemedTextInput
                    label="Password"
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    keyboardType="default"
                    error={error}
                    secureTextEntry={true}
                />
                <Button title="Sign in" onPress={signUpNewUser} />
            </ThemedView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    link: {
        marginTop: 15,
        paddingVertical: 15,
    },
    picker: {
        height: 200,
        width: 200,
    },
});
