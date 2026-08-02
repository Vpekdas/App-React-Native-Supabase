import ThemedButton from "@/components/buttons/themed-button";
import ThemedProfileCard from "@/components/card/themed-profile-card";
import ThemedModal from "@/components/modal/themed-modal";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedTextInput } from "@/components/text/themed-text-input";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, useColorScheme } from "react-native";
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

    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    const [topic, setTopic] = useState("");
    const [profiles, setProfiles] = useState<SearchAccountantPublicRow[]>([]);
    const [errors, setErrors] = useState<{ topic?: string }>({});

    const [selectedAccountant, setSelectedAccountant] = useState<SearchAccountantPublicRow | null>(null);

    const [slots, setSlots] = useState<DaySlots[]>([]);

    const fetchProfiles = async () => {
        setProfiles([]);

        const q = topic.trim();

        if (!q) {
            setErrors({
                topic: "Veuillez entrer un sujet",
            });
            return;
        }

        setErrors({});

        const { data, error } = await supabase.rpc("search_accountant_public", {
            search: q,
        });

        if (error) return;

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

        if (res.error) return;

        setSelectedAccountant(null);
        setSlots([]);
    };

    return (
        <SafeAreaView
            style={[
                styles.safeArea,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <ThemedView style={styles.container}>
                <ThemedText
                    style={[
                        styles.title,
                        {
                            color: colors.primary,
                        },
                    ]}
                >
                    Trouver votre expert-comptable
                </ThemedText>

                <ThemedText
                    style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                        },
                    ]}
                >
                    Recherchez des professionnels et réservez un créneau qui vous convient.
                </ThemedText>

                <ThemedTextInput
                    label="Sujet"
                    placeholder="Exemple : Fiscalité, Audit, Finance"
                    value={topic}
                    onChangeText={setTopic}
                    error={errors.topic}
                    style={styles.input}
                />

                <ThemedButton title="Rechercher" onPress={fetchProfiles} />

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
                    title="Sélectionner un créneau horaire"
                    onClose={() => setSelectedAccountant(null)}
                >
                    <ThemedView style={styles.modalContent}>
                        <FlatList
                            data={slots}
                            keyExtractor={(item) => item.date}
                            renderItem={({ item }) => (
                                <ThemedView style={styles.day}>
                                    <ThemedText
                                        style={[
                                            styles.dayTitle,
                                            {
                                                color: colors.primary,
                                            },
                                        ]}
                                    >
                                        {new Date(item.date).toLocaleDateString("fr-FR", {
                                            weekday: "long",
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                    </ThemedText>

                                    {item.slots.length === 0 ? (
                                        <ThemedText
                                            style={{
                                                color: colors.textMuted,
                                            }}
                                        >
                                            Aucune disponibilité
                                        </ThemedText>
                                    ) : (
                                        <FlatList
                                            data={item.slots}
                                            keyExtractor={(_, i) => `${item.date}-${i}`}
                                            renderItem={({ item: slot }) => (
                                                <Pressable
                                                    style={[
                                                        styles.slot,
                                                        {
                                                            backgroundColor: colors.mist,
                                                            borderColor: colors.borderStrong,
                                                        },
                                                    ]}
                                                    onPress={() => bookSlot(slot, item.date)}
                                                >
                                                    <ThemedText
                                                        style={[
                                                            styles.slotText,
                                                            {
                                                                color: colors.primary,
                                                            },
                                                        ]}
                                                    >
                                                        {new Date(slot.start_time).toLocaleTimeString([], {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })}
                                                        {" - "}
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
    safeArea: {
        flex: 1,
    },

    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
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
        marginBottom: 28,
    },

    input: {
        marginBottom: 14,
    },

    profileList: {
        marginTop: 24,
        paddingBottom: 40,
        gap: 14,
    },

    modalContent: {
        maxHeight: 400,
    },

    day: {
        marginBottom: 24,
    },

    dayTitle: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 17,
        marginBottom: 12,
    },

    slot: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 10,
    },

    slotText: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 15,
        textAlign: "center",
    },
});
