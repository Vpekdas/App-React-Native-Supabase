import React, { useState } from "react";
import { Alert, Button, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/view/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";

import ThemedButton from "@/components/buttons/themed-button";
import ThemedStudentCard from "@/components/card/themed-student-card";
import { ThemedPicker } from "@/components/picker/themed-picker";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { Picker } from "@react-native-picker/picker";
import { File as ExpoFile, Paths } from "expo-file-system";
import { FlatList } from "react-native";

type StudentResumeRow = {
    id: string;
    first_name: string;
    last_name: string;
    education_year: number | null;
    topic: string;
    topic_description: string;
    resume_updated_at: string | null;
    resume_path: string;
};

export default function Resume() {
    const { profile } = useAuthContext();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [topicQuery, setTopicQuery] = useState("");
    const [educationYear, setEducationYear] = useState<string>("");
    const [rows, setRows] = useState<StudentResumeRow[]>([]);
    const [loading, setLoading] = useState(false);

    const filePathForUser = (userId: string) => `${userId}/resume.pdf`;

    const uploadResume = async () => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");
            if (profile.user_type !== "student") throw new Error("Only students can upload resumes");

            const filePath = filePathForUser(profile.id);

            if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/pdf";

                const file = await new Promise<File>((resolve, reject) => {
                    input.onchange = () => {
                        const f = input.files?.[0];
                        if (!f) return reject(new Error("No file selected"));
                        resolve(f);
                    };
                    input.click();
                });

                if (file.type !== "application/pdf") throw new Error("Only PDF files allowed");

                const { error } = await supabase.storage.from("resume").upload(filePath, file, {
                    upsert: true,
                    contentType: "application/pdf",
                });
                if (error) throw error;

                await supabase.from("resume_meta").upsert({
                    user_id: profile.id,
                    storage_path: filePath,
                    updated_at: new Date().toISOString(),
                });

                Alert.alert("Success", "Resume uploaded correctly");
                return;
            }

            const { pick } = require("@react-native-documents/picker");
            const results = await pick({ allowMultiSelection: false });
            const picked = results[0];

            if (picked.type !== "application/pdf") throw new Error("Only PDF files allowed");

            const response = await fetch(picked.uri);
            const arrayBuffer = await response.arrayBuffer();
            if (!arrayBuffer || arrayBuffer.byteLength === 0) throw new Error("File is empty or unreadable");

            const { error } = await supabase.storage.from("resume").upload(filePath, arrayBuffer, {
                upsert: true,
                contentType: "application/pdf",
            });
            if (error) throw error;

            await supabase.from("resume_meta").upsert({
                user_id: profile.id,
                storage_path: filePath,
                updated_at: new Date().toISOString(),
            });

            Alert.alert("Success", "Resume uploaded correctly");
        } catch (err) {
            Alert.alert("Error", String(err));
        }
    };

    const viewRemote = async () => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");
            if (profile.user_type !== "student") throw new Error("Only students can view their own resume here");

            const filePath = filePathForUser(profile.id);

            const { data, error } = await supabase.storage.from("resume").createSignedUrl(filePath, 60 * 5);
            if (error) throw error;

            if (Platform.OS === "web") {
                window.open(data.signedUrl, "_blank", "noopener,noreferrer");
                return;
            }

            const { viewDocument } = require("@react-native-documents/viewer");

            let localFile = new ExpoFile(Paths.document, "resume.pdf");
            if (localFile.exists) localFile.delete();

            const result = await ExpoFile.downloadFileAsync(data.signedUrl, localFile);

            await viewDocument({
                uri: result.uri,
                mimeType: "application/pdf",
            });
        } catch (err) {
            Alert.alert("Error", String(err));
        }
    };

    const fetchStudents = async () => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");
            if (profile.user_type !== "chartered_accountant") throw new Error("Not allowed");

            const ey = educationYear.trim();
            const year = ey ? Number(ey) : null;

            if (ey && !Number.isFinite(year)) {
                Alert.alert("Invalid year", "Education year must be a number");
                return;
            }

            const { data, error } = await supabase.rpc("list_students_with_resume", {
                only_with_resume: true,
                first_name_filter: firstName.trim() || null,
                last_name_filter: lastName.trim() || null,
                topic_filter: topicQuery.trim() || null,
                education_year_filter: year,
            });

            if (error) throw error;

            setRows((data ?? []) as StudentResumeRow[]);
        } catch (err) {
            Alert.alert("Error", String(err));
        } finally {
            setLoading(false);
        }
    };

    const openStudentResume = async (row: StudentResumeRow) => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");
            if (profile.user_type !== "chartered_accountant") throw new Error("Not allowed");

            const { data, error } = await supabase.storage.from("resume").createSignedUrl(row.resume_path, 60 * 5);
            if (error) throw error;

            if (Platform.OS === "web") {
                window.open(data.signedUrl, "_blank", "noopener,noreferrer");
                return;
            }

            const { viewDocument } = require("@react-native-documents/viewer");

            const filenameSafe = row.id.replace(/[^a-zA-Z0-9_-]/g, "");
            let localFile = new ExpoFile(Paths.document, `resume_${filenameSafe}.pdf`);

            if (!localFile.exists) {
                await ExpoFile.downloadFileAsync(data.signedUrl, localFile);
            }

            await viewDocument({
                uri: localFile.uri,
                mimeType: "application/pdf",
            });
        } catch (err) {
            Alert.alert("Error", String(err));
        }
    };

    const isStudent = profile?.user_type === "student";
    const isAccountant = profile?.user_type === "chartered_accountant";

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                {isStudent && (
                    <>
                        <ThemedButton title="Upload Resume" onPress={uploadResume} />
                        <ThemedButton title="View My Resume" onPress={viewRemote} />
                    </>
                )}

                {isAccountant && (
                    <>
                        <ThemedText type="title">Students resumes</ThemedText>

                        <ThemedTextInput
                            label="First name"
                            placeholder="e.g. John"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <ThemedTextInput
                            label="Last name"
                            placeholder="e.g. Doe"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <ThemedTextInput
                            label="Topic contains"
                            placeholder="e.g. audit"
                            value={topicQuery}
                            onChangeText={setTopicQuery}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />

                        <ThemedPicker
                            label="Education Year"
                            selectedValue={educationYear}
                            onValueChange={(itemValue) => setEducationYear(itemValue as string)}
                            style={styles.picker}
                        >
                            <Picker.Item label="All" value="" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                        </ThemedPicker>

                        <ThemedView style={styles.row}>
                            <Button
                                title={loading ? "Loading..." : "Search"}
                                onPress={fetchStudents}
                                disabled={loading}
                            />
                        </ThemedView>

                        <FlatList
                            data={rows}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={styles.list}
                            keyboardShouldPersistTaps="handled"
                            renderItem={({ item }) => (
                                <ThemedStudentCard
                                    first_name={item.first_name}
                                    last_name={item.last_name}
                                    topic={item.topic}
                                    topic_description={item.topic_description}
                                    onPress={() => openStudentResume(item)}
                                />
                            )}
                        />
                    </>
                )}
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        gap: 12,
    },
    input: {
        marginBottom: 10,
        padding: 10,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between",
    },
    list: {
        marginTop: 10,
        gap: 10,
        paddingBottom: 24,
    },
    picker: {
        marginBottom: 12,
    },
});
