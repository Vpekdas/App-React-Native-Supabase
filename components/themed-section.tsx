import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, View } from "react-native";

type ThemedSectionProps = {
    id: string;
    onMeasure: (id: string, y: number) => void;
    children: React.ReactNode;
};

export default function ThemedSection({ id, onMeasure, children }: ThemedSectionProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <View
            onLayout={(e) => {
                onMeasure(id, e.nativeEvent.layout.y);
            }}
            style={[styles.section, { borderBottomColor: theme.border }]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 20,
    },
});
