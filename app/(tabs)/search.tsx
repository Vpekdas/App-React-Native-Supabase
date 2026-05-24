import ThemedButton from "@/components/buttons/themed-button";
import ThemedProfileCard from "@/components/card/themed-profile-card";
import ThemedModal from "@/components/modal/themed-modal";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface SearchAccountantPublicRow {
    user_id: string;
    topic: string;
    topic_description: string;
}

interface Slot {
    start_time: string;
    end_time: string;
}

interface DaySlots {
    date: string;
    slots: Slot[];
}

export default function Search() {
    const { profile } = useAuthContext();

    const [topic, setTopic] = useState("");
    const [profiles, setProfiles] = useState<SearchAccountantPublicRow[]>([]);
    const [errors, setErrors] = useState<{ topic?: string }>({});

    const [selectedAccountant, setSelectedAccountant] = useState<SearchAccountantPublicRow | null>(null);

    const [slots, setSlots] = useState<DaySlots[]>([]);

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

    const openBookingModal = async (accountant: SearchAccountantPublicRow) => {
        setSelectedAccountant(accountant);

        const today = new Date();

        const weekRequests = Array.from({ length: 7 }).map(async (_, i) => {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const isoDate = date.toISOString().split("T")[0];

            const { data, error } = await supabase.rpc("get_available_slots", {
                p_accountant_id: accountant.user_id,
                p_date: isoDate,
            });

            if (error) {
                console.error(error);
                return {
                    date: isoDate,
                    slots: [],
                };
            }

            return {
                date: isoDate,
                slots: (data ?? []) as Slot[],
            };
        });

        const result = await Promise.all(weekRequests);

        setSlots(result);
    };

    const bookSlot = async (slot: Slot, date: string) => {
        if (!selectedAccountant) return;

        const res = await supabase.functions.invoke("create-meeting", {
            body: JSON.stringify({
                accountantId: selectedAccountant.user_id,
                studentId: profile?.id,
                startsAt: slot.start_time,
                endsAt: slot.end_time,
            }),
        });

        if (res.error) {
            console.error(res.error);
            alert("Error creating meeting");
            return;
        }

        alert("Meeting created! Join at " + res.data.meetingLink);

        setSelectedAccountant(null);
        setSlots([]);
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
                />

                <ThemedButton title="Search" onPress={fetchProfiles} />

                <FlatList
                    data={profiles}
                    keyExtractor={(item) => item.user_id}
                    contentContainerStyle={styles.profileList}
                    renderItem={({ item }) => (
                        <ThemedProfileCard
                            topic={item.topic}
                            description={item.topic_description}
                            onPress={() => openBookingModal(item)}
                        />
                    )}
                />

                <ThemedModal
                    visible={!!selectedAccountant}
                    title="Select a time slot"
                    onClose={() => setSelectedAccountant(null)}
                >
                    <ThemedView style={{ maxHeight: 400 }}>
                        <FlatList
                            data={slots}
                            keyExtractor={(item) => item.date}
                            renderItem={({ item }) => (
                                <ThemedView style={{ marginBottom: 20 }}>
                                    <ThemedText style={{ fontWeight: "bold", marginBottom: 10 }}>
                                        {new Date(item.date).toLocaleDateString("en-GB", {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </ThemedText>

                                    {item.slots.length === 0 ? (
                                        <ThemedText style={{ opacity: 0.5 }}>No availability</ThemedText>
                                    ) : (
                                        <FlatList
                                            data={item.slots}
                                            keyExtractor={(_, i) => `${item.date}-slot-${i}`}
                                            renderItem={({ item: slot }) => (
                                                <Pressable
                                                    style={styles.slot}
                                                    onPress={() => bookSlot(slot, item.date)}
                                                >
                                                    <ThemedText style={styles.slotText}>
                                                        {new Date(slot.start_time).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}{" "}
                                                        -{" "}
                                                        {new Date(slot.end_time).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                    </ThemedText>
                                                </Pressable>
                                            )}
                                        />
                                    )}
                                </ThemedView>
                            )}
                        />
                    </ThemedView>
                </ThemedModal>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },

    profileList: {
        marginTop: 20,
        gap: 10,
    },

    input: {
        marginBottom: 12,
    },

    slot: {
        padding: 15,
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 10,
    },

    slotText: {
        fontSize: 16,
    },
});
