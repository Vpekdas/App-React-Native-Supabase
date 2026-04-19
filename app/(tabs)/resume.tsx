import React from "react";
import { Alert, Button, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";

import { File as ExpoFile, Paths } from "expo-file-system";

export default function Resume() {
    const { profile } = useAuthContext();

    const filePathForUser = (userId: string) => `${userId}/resume.pdf`;

    const uploadResume = async () => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");

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

                if (file.type !== "application/pdf") {
                    throw new Error("Only PDF files allowed");
                }

                const { error } = await supabase.storage.from("resume").upload(filePath, file, {
                    upsert: true,
                    contentType: "application/pdf",
                });

                if (error) throw error;

                Alert.alert("Success", "Resume uploaded correctly");
                return;
            }

            const { pick } = require("@react-native-documents/picker");
            const results = await pick({ allowMultiSelection: false });
            const picked = results[0];

            if (picked.type !== "application/pdf") {
                throw new Error("Only PDF files allowed");
            }

            const response = await fetch(picked.uri);
            const arrayBuffer = await response.arrayBuffer();

            if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                throw new Error("File is empty or unreadable");
            }

            const { error } = await supabase.storage.from("resume").upload(filePath, arrayBuffer, {
                upsert: true,
                contentType: "application/pdf",
            });

            if (error) throw error;

            Alert.alert("Success", "Resume uploaded correctly");
        } catch (err) {
            Alert.alert("Error", String(err));
        }
    };

    const viewRemote = async () => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                {profile?.user_type === "student" && (
                    <>
                        <Button title="Upload Resume" onPress={uploadResume} />
                        <Button title="View My Resume" onPress={viewRemote} />
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
});
