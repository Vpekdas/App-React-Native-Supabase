import { ThemedText } from "@/components/text/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, View } from "react-native";

type Props = {
    title: string;
    description: string;
};

export function ThemedCard({ title, description }: Props) {
    const backgroundColor = useThemeColor({}, "background");
    const borderColor = useThemeColor({}, "border");

    return (
        <View style={[styles.card, { backgroundColor, borderColor }]}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.desc}>{description}</ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
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
