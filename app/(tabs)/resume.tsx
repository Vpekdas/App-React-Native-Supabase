import React from "react";
import { Alert, Button, Platform, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";

import { File, Paths } from "expo-file-system";

export default function Resume() {
    const { profile } = useAuthContext();

    const handleError = (err: unknown) => {
        if (err && typeof err === "object" && "code" in err) {
            const e = err as any;

            if (e.code === "DOCUMENT_PICKER_CANCELED") return;

            Alert.alert("Error", e.message || "Unknown error");
        } else {
            console.error(err);
            Alert.alert("Error", String(err));
        }
    };

    const uploadResume = async () => {
        try {
            if (!profile?.id) throw new Error("Not authenticated");

            if (Platform.OS === "web") {
                throw new Error("File upload not supported on web yet");
            }

            const { pick } = require("@react-native-documents/picker");

            const results = await pick({ allowMultiSelection: false });
            const file = results[0];

            if (file.type !== "application/pdf") {
                throw new Error("Only PDF files allowed");
            }

            const filePath = `${profile.id}/resume.pdf`;

            const response = await fetch(file.uri);
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

            if (Platform.OS === "web") {
                throw new Error("Viewing not supported on web");
            }

            const { viewDocument } = require("@react-native-documents/viewer");

            const filePath = `${profile.id}/resume.pdf`;
            const { data, error } = await supabase.storage.from("resume").createSignedUrl(filePath, 60 * 5);

            if (error) throw error;

            let file = new File(Paths.document, "resume.pdf");
            if (file.exists) file.delete();

            const result = await File.downloadFileAsync(data.signedUrl, file);

            await viewDocument({
                uri: result.uri,
                mimeType: "application/pdf",
            });
        } catch (err) {
            console.error(err);
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
