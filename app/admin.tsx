import ThemedButton from "@/components/buttons/themed-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";

type PendingRow = {
    id: string;
    first_name: string;
    last_name: string;
    education_year: number | null;
    requested_user_type: string | null;
    supra: string;
};

export default function Admin() {
    const [rows, setRows] = useState<PendingRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [approvingId, setApprovingId] = useState<string | null>(null);
    const { isAdmin, isLoading: authLoading } = useAuthContext();

    const load = async () => {
        if (!isAdmin) return;
        setLoading(true);

        try {
            const { data, error } = await supabase.functions.invoke("list-pending-accountants");
            if (error) throw error;
            setRows((data?.data ?? []) as PendingRow[]);
        } catch (e) {
            Alert.alert("Erreur", String(e));
        } finally {
            setLoading(false);
        }
    };

    const approve = async (userId: string) => {
        setApprovingId(userId);
        try {
            const { error } = await supabase.functions.invoke("approve-accountant", {
                body: { user_id: userId },
            });
            if (error) throw error;
            await load();
            Alert.alert("Approuvé", "Utilisateur promu au rôle d'expert-comptable");
        } catch (e) {
            Alert.alert("Error", String(e));
        } finally {
            setApprovingId(null);
        }
    };

    useEffect(() => {
        if (!authLoading && isAdmin) {
            load();
        }
    }, [authLoading, isAdmin]);

    return (
        <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
            <ThemedText type="title">Demandes d'experts-comptables en attente</ThemedText>{" "}
            <ThemedButton title={loading ? "Chargement..." : "Actualiser"} onPress={load} />{" "}
            <FlatList
                data={rows}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
                renderItem={({ item }) => (
                    <ThemedView style={{ gap: 6, padding: 12, borderWidth: 1, borderRadius: 10 }}>
                        <ThemedText>{item.first_name}</ThemedText>
                        <ThemedText>{item.last_name}</ThemedText>
                        <ThemedText>{item.supra}</ThemedText>

                        <ThemedButton
                            title={approvingId === item.id ? "Validation..." : "Valider"}
                            onPress={() => approve(item.id)}
                        />
                    </ThemedView>
                )}
                ListEmptyComponent={<ThemedText>Aucune demande en attente.</ThemedText>}
            />
        </ThemedView>
    );
}
