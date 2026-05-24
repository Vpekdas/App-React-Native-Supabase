import SignOutButton from "@/components/buttons/sign-out-button";
import ThemedItem from "@/components/item/themed-item";
import { ThemedView } from "@/components/view/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";
import { StyleSheet } from "react-native";

export default function Account() {
    const { isAdmin } = useAuthContext();

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.itemContainer}>
                <ThemedItem href="/change-password" label="Password" icon="lock-closed-outline" />

                <ThemedItem href="/resume" label="Resume" icon="document-text-outline" />

                <ThemedItem href="/availability" label="Availability" icon="calendar-outline" />

                {isAdmin && <ThemedItem href="/admin" label="Admin" icon="shield-checkmark-outline" />}
            </ThemedView>

            <ThemedView style={styles.footer}>
                <SignOutButton />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    itemContainer: {
        flex: 1,
        gap: 10,
    },

    footer: {
        marginTop: 20,
        alignItems: "center",
    },
});
