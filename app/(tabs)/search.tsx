import ThemedButton from "@/components/buttons/themed-button";
import ThemedProfileCard from "@/components/card/themed-profile-card";
import { ThemedPicker } from "@/components/picker/themed-picker";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Profile {
    id: string;
    first_name: string;
    theme: string;
}

export default function Search() {
    const [theme, setTheme] = useState("");
    const [profiles, setProfiles] = useState<Profile[]>([]);

    const fetchProfiles = async () => {
        setProfiles([]);

        if (!theme) return;
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("theme", theme)
            .eq("user_type", "chartered_accountant");
        if (error) {
            console.error("Error fetching profiles:", error);
            return;
        }

        setProfiles(data);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.container}>
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

                <ThemedButton title="Search" onPress={fetchProfiles} />

                <FlatList
                    data={profiles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ThemedProfileCard name={item.first_name} theme={item.theme} />}
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
});
