import ThemedMeetingCard from "@/components/card/themed-meeting-card";
import { ThemedText } from "@/components/text/themed-text";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type Meeting = {
    id: string;
    student_topic: string;
    student_topic_description: string;
    accountant_topic: string;
    accountant_topic_description: string;
    starts_at: string;
    ends_at: string;
    room_name: string;
    student: {
        first_name: string;
        last_name: string;
    };
};

export default function Meeting() {
    const { profile } = useAuthContext();

    const [meetings, setMeetings] = useState<Meeting[]>([]);

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        if (!profile?.id) return;

        const { data, error } = await supabase
            .from("meetings")
            .select(
                `
                id,
                student_topic,
                accountant_topic,
                starts_at,
                ends_at,
                room_name,
                student:student_id (
                    first_name,
                    last_name
                )
            `,
            )
            .or(`student_id.eq.${profile.id},accountant_id.eq.${profile.id}`)
            .order("starts_at", { ascending: true });

        if (error) {
            console.error(error);
            return;
        }

        setMeetings((data ?? []) as Meeting[]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={meetings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<ThemedText>No meetings found.</ThemedText>}
                renderItem={({ item }) => (
                    <ThemedMeetingCard
                        topic={item.student_topic + " -> " + item.accountant_topic}
                        studentName={`${item.student.first_name} ${item.student.last_name}`}
                        startsAt={item.starts_at}
                        endsAt={item.ends_at}
                        roomName={item.room_name}
                    />
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    list: {
        gap: 12,
    },

    card: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
    },

    topic: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 8,
    },

    student: {
        marginBottom: 8,
    },
});
