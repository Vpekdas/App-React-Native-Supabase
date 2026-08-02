import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet } from "react-native";
import { ThemedView } from "../view/themed-view";

type ThemedSectionProps = {
    id: string;
    onMeasure: (id: string, y: number) => void;
    children: React.ReactNode;
};

export default function ThemedSection({ id, onMeasure, children }: ThemedSectionProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <ThemedView
            onLayout={(e) => {
                onMeasure(id, e.nativeEvent.layout.y);
            }}
            style={[styles.section, { borderBottomColor: theme.border }]}
        >
            {children}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
    },
});
