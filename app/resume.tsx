import React, { useState } from "react";
import { Alert, Platform, StyleSheet, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/view/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";

import ThemedButton from "@/components/buttons/themed-button";
import ThemedStudentCard from "@/components/card/themed-student-card";
import { ThemedPicker } from "@/components/picker/themed-picker";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { Colors, Fonts } from "@/constants/theme";
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
    const colorScheme = useColorScheme() ?? "light";
    const theme = Colors[colorScheme];

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [topicQuery, setTopicQuery] = useState("");
    const [educationYear, setEducationYear] = useState<string>("");
    const [rows, setRows] = useState<StudentResumeRow[]>([]);
    const [loading, setLoading] = useState(false);

    const filePathForUser = (userId: string) => `${userId}/resume.pdf`;

    const uploadResume = async () => {
        try {
            if (!profile?.id) throw new Error("Non authentifié");
            if (profile.user_type !== "student") throw new Error("Seuls les étudiants peuvent téléverser des CV");

            const filePath = filePathForUser(profile.id);

            if (Platform.OS === "web") {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "application/pdf";

                const file = await new Promise<File>((resolve, reject) => {
                    input.onchange = () => {
                        const f = input.files?.[0];
                        if (!f) return reject(new Error("Aucun fichier sélectionné"));
                        resolve(f);
                    };
                    input.click();
                });

                if (file.type !== "application/pdf") throw new Error("Seuls les fichiers PDF sont autorisés");

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

                Alert.alert("Succès", "CV téléversé correctement");
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

            Alert.alert("Success", "CV téléversé correctement");
        } catch (err) {
            Alert.alert("Erreur", String(err));
        }
    };

    const viewRemote = async () => {
        try {
            if (!profile?.id) throw new Error("Non authentifié");
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
            Alert.alert("Erreur", String(err));
        }
    };

    const fetchStudents = async () => {
        try {
            if (!profile?.id) throw new Error("Non authentifié");
            if (profile.user_type !== "chartered_accountant") throw new Error("Non autorisé");

            const ey = educationYear.trim();
            const year = ey ? Number(ey) : null;

            if (ey && !Number.isFinite(year)) {
                Alert.alert("Année invalide", "L’année d’études doit être un nombre");
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
            Alert.alert("Erreur", String(err));
        } finally {
            setLoading(false);
        }
    };

    const openStudentResume = async (row: StudentResumeRow) => {
        try {
            if (!profile?.id) throw new Error("Non authentifié");
            if (profile.user_type !== "chartered_accountant") throw new Error("Non autorisé");

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
            Alert.alert("Erreur", String(err));
        }
    };

    const isStudent = profile?.user_type === "student";
    const isAccountant = profile?.user_type === "chartered_accountant";

    return (
        <SafeAreaView
            style={[
                styles.safe,
                {
                    backgroundColor: theme.background,
                },
            ]}
        >
            <ThemedView style={styles.container}>
                {isStudent && (
                    <>
                        <ThemedView style={styles.header}>
                            <ThemedText style={styles.title}>Votre CV</ThemedText>

                            <ThemedText style={styles.description}>
                                Téléversez et gérez votre CV pour que les comptables puissent l’examiner.
                            </ThemedText>
                        </ThemedView>

                        <ThemedView
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <ThemedButton title="Téléverser le CV" onPress={uploadResume} />
                            <ThemedButton title="Voir mon CV" onPress={viewRemote} />
                        </ThemedView>
                    </>
                )}

                {isAccountant && (
                    <>
                        <ThemedView style={styles.header}>
                            <ThemedText style={styles.title}>CV des étudiants</ThemedText>

                            <ThemedText style={styles.description}>
                                Recherchez des étudiants et consultez leurs profils.
                            </ThemedText>
                        </ThemedView>

                        <ThemedView
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                },
                            ]}
                        >
                            <ThemedTextInput
                                label="Prénom"
                                placeholder="Jean"
                                value={firstName}
                                onChangeText={setFirstName}
                                style={styles.input}
                            />

                            <ThemedTextInput
                                label="Nom"
                                placeholder="Dupont"
                                value={lastName}
                                onChangeText={setLastName}
                                style={styles.input}
                            />

                            <ThemedTextInput
                                label="Sujet"
                                placeholder="Audit"
                                value={topicQuery}
                                onChangeText={setTopicQuery}
                                style={styles.input}
                            />

                            <ThemedPicker
                                label="Année d’études"
                                selectedValue={educationYear}
                                onValueChange={(value) => setEducationYear(value as string)}
                            >
                                <Picker.Item label="Tous" value="" />
                                <Picker.Item label="1" value="1" />
                                <Picker.Item label="2" value="2" />
                                <Picker.Item label="3" value="3" />
                            </ThemedPicker>

                            <ThemedButton
                                title={loading ? "Recherche..." : "Rechercher des étudiants"}
                                onPress={fetchStudents}
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
    safe: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 28,
        gap: 16,
    },

    header: {
        marginBottom: 8,
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 34,
        lineHeight: 42,
    },

    description: {
        fontFamily: Fonts.sans,
        fontSize: 16,
        marginTop: 6,
        opacity: 0.75,
    },

    card: {
        borderWidth: 1,
        borderRadius: 18,
        padding: 18,
        gap: 14,
    },

    input: {
        marginBottom: 8,
    },

    list: {
        gap: 14,
        paddingBottom: 30,
    },
});
