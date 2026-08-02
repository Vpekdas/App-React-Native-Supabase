import ThemedMeetingCard from "@/components/card/themed-meeting-card";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, useColorScheme } from "react-native";
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

    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

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
            .order("starts_at", {
                ascending: true,
            });

        if (error) return;

        setMeetings((data ?? []) as Meeting[]);
    };

    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <ThemedView style={styles.header}>
                <ThemedText
                    style={[
                        styles.title,
                        {
                            color: colors.primary,
                        },
                    ]}
                >
                    Vos rendez-vous
                </ThemedText>

                <ThemedText
                    style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                        },
                    ]}
                >
                    Suivez vos prochaines sessions.
                </ThemedText>
            </ThemedView>

            <FlatList
                data={meetings}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <ThemedText
                        style={[
                            styles.empty,
                            {
                                color: colors.textMuted,
                            },
                        ]}
                    >
                        Aucun rendez-vous trouvé.
                    </ThemedText>
                }
                renderItem={({ item }) => (
                    <ThemedMeetingCard
                        topic={item.student_topic + " → " + item.accountant_topic}
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
        paddingHorizontal: 24,
        paddingTop: 24,
    },

    header: {
        marginBottom: 28,
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 36,
        lineHeight: 44,
        marginBottom: 8,
    },

    subtitle: {
        fontFamily: Fonts.sans,
        fontSize: 16,
        lineHeight: 24,
    },

    list: {
        gap: 16,
        paddingBottom: 40,
    },

    empty: {
        fontFamily: Fonts.sans,
        fontSize: 16,
        textAlign: "center",
        marginTop: 40,
    },
});
