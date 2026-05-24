import { Colors } from "@/constants/theme";
import { StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

export type MeetingCardProps = {
    topic: string;
    studentName: string;
    startsAt: string;
    endsAt: string;
    roomName: string;
};

export default function ThemedMeetingCard({ topic, studentName, startsAt, endsAt, roomName }: MeetingCardProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    borderColor: theme.border,
                    backgroundColor: theme.background,
                },
            ]}
        >
            <ThemedText style={styles.topic}>{topic}</ThemedText>
            <ThemedText style={styles.text}>Student: {studentName}</ThemedText>
            <ThemedText style={styles.text}>Start: {new Date(startsAt).toLocaleString()}</ThemedText>
            <ThemedText style={styles.text}>End: {new Date(endsAt).toLocaleString()}</ThemedText>
            <ThemedText style={styles.text}>Link: {"https://meet.jit.si/" + roomName}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
    },

    topic: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },

    text: {
        fontSize: 14,
        marginBottom: 4,
    },
});
