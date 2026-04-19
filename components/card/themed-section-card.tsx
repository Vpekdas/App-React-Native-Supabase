import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { StyleSheet, useColorScheme, View } from "react-native";

type Props = {
    title: string;
    description: string;
};

export function ThemedCard({ title, description }: Props) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <View style={[styles.card, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <ThemedText style={[styles.title, { color: theme.text }]}>{title}</ThemedText>
            <ThemedText style={[styles.desc, { color: theme.text }]}>{description}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        width: "100%",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    desc: {
        fontSize: 13,
        opacity: 0.7,
    },
});
