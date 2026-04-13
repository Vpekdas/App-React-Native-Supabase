import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Link } from "expo-router";
import { StyleSheet } from "react-native";

export default function Account() {
    return (
        <ThemedView style={styles.container}>
            <Link href="/change-password">
                <ThemedText>Password</ThemedText>
            </Link>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
});
