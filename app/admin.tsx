import SignOutButton from "@/components/buttons/sign-out-button";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/themed-view";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Alert, Button, FlatList, View } from "react-native";

type PendingRow = {
    id: string;
    first_name: string;
    last_name: string;
    education_year: number | null;
    requested_user_type: string | null;
};

export default function Admin() {
    const [rows, setRows] = useState<PendingRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [approvingId, setApprovingId] = useState<string | null>(null);

    const load = async () => {
        setLoading(true);
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            console.log("Admin.load session user:", session?.user?.id, session?.user?.email);
            console.log("Admin.load has access_token?", !!session?.access_token);

            const { data, error } = await supabase.functions.invoke("list-pending-accountants");

            if (error) throw error;
            setRows((data?.data ?? []) as PendingRow[]);
        } catch (e) {
            Alert.alert("Error", String(e));
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
            Alert.alert("Approved", "User promoted to chartered_accountant");
        } catch (e) {
            Alert.alert("Error", String(e));
        } finally {
            setApprovingId(null);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <ThemedView style={{ flex: 1, padding: 16, gap: 12 }}>
            <ThemedText type="title">Pending accountant requests</ThemedText>
            <Button title={loading ? "Loading..." : "Refresh"} onPress={load} disabled={loading} />

            <FlatList
                data={rows}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 12, paddingVertical: 12 }}
                renderItem={({ item }) => (
                    <View style={{ gap: 6, padding: 12, borderWidth: 1, borderRadius: 10 }}>
                        <ThemedText>
                            {item.first_name} {item.last_name} ({item.education_year ?? "—"})
                        </ThemedText>
                        <Button
                            title={approvingId === item.id ? "Approving..." : "Approve"}
                            onPress={() => approve(item.id)}
                            disabled={approvingId !== null}
                        />
                    </View>
                )}
                ListEmptyComponent={<ThemedText>No pending requests.</ThemedText>}
            />

            <SignOutButton />
        </ThemedView>
    );
}
