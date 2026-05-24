import { ThemedText } from "@/components/text/themed-text";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function VerifyMail() {
    const [isLoading] = useState(false);

    return (
        <View style={styles.container}>
            <ThemedText style={styles.title}>Verify Your Email</ThemedText>
            <ThemedText style={styles.description}>
                We’ve sent you a confirmation email. Please check your inbox and click the link. Once verified, you’ll
                be automatically redirected.
            </ThemedText>

            {isLoading ? <ActivityIndicator size="large" /> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        gap: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    description: {
        fontSize: 16,
        textAlign: "center",
    },
});
