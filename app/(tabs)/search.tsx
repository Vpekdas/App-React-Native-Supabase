import ThemedButton from "@/components/buttons/themed-button";
import ThemedProfileCard from "@/components/card/themed-profile-card";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SearchAccountantPublicRow {
    user_id: string;
    topic: string;
    topic_description: string;
    rank: number;
    topic_highlight: string;
}

export default function Search() {
    const [topic, setTopic] = useState("");
    const [profiles, setProfiles] = useState<SearchAccountantPublicRow[]>([]);

    const [errors, setErrors] = useState<{
        topic?: string;
        topicDescription?: string;
    }>({});

    const fetchProfiles = async () => {
        setProfiles([]);

        const q = topic.trim();
        if (!q) return;

        const { data, error } = await supabase.rpc("search_accountant_public", {
            search: q,
        });

        if (error) {
            console.error("Error searching profiles:", error);
            return;
        }

        setProfiles((data ?? []) as SearchAccountantPublicRow[]);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
                <ThemedTextInput
                    label="Topic"
                    placeholder="Topic"
                    value={topic}
                    onChangeText={setTopic}
                    error={errors.topic}
                    style={styles.input}
                    textContentType="none"
                    importantForAutofill="no"
                />

                <ThemedButton title="Search" onPress={fetchProfiles} />

                <FlatList
                    data={profiles}
                    keyExtractor={(item) => item.user_id}
                    renderItem={({ item }) => (
                        <ThemedProfileCard topic={item.topic} description={item.topic_description} />
                    )}
                    contentContainerStyle={styles.profileList}
                />
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    picker: {
        marginBottom: 12,
    },
    profileList: {
        marginTop: 20,
        gap: 10,
    },
    input: {
        marginBottom: 12,
        padding: 10,
    },
});
