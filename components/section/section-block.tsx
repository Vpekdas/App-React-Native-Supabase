import { Platform, StyleSheet, View } from "react-native";
import { ThemedText } from "../text/themed-text";

interface SectionBlockProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export default function SectionBlock({ title, description, children }: SectionBlockProps) {
    return (
        <View style={styles.section}>
            <ThemedText style={styles.title}>{title}</ThemedText>
            {description && <ThemedText style={styles.description}>{description}</ThemedText>}
            <View style={[styles.cardRow, Platform.OS === "web" ? styles.rowWeb : styles.rowMobile]}>{children}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 16,
        paddingTop: 30,
        paddingBottom: 16,
        marginBottom: "10%",
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 4,
        width: "100%",
        lineHeight: 36,
    },
    description: {
        fontSize: 18,
        fontWeight: "400",
        textAlign: "center",
        marginBottom: 12,
        opacity: 0.8,
        width: "100%",
    },
    cardRow: {
        gap: 12,
    },
    rowMobile: {
        flexDirection: "column",
        alignItems: "center",
    },
    rowWeb: {
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "stretch",
        gap: 12,
    },
});
