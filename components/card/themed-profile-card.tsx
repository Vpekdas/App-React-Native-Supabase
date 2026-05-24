import { Colors } from "@/constants/theme";
import { Pressable, StyleSheet, useColorScheme } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

export type ProfileProps = {
    topic: string;
    description: string;
    onPress?: () => void;
};

export default function ThemedProfileCard({ topic, description, onPress }: ProfileProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <Pressable onPress={onPress}>
            <ThemedView
                style={[
                    {
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                    },
                    styles.container,
                ]}
            >
                <ThemedText
                    style={[
                        styles.name,
                        {
                            color: theme.text,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    {topic}
                </ThemedText>

                <ThemedText
                    style={[
                        styles.theme,
                        {
                            color: theme.text,
                            backgroundColor: theme.background,
                        },
                    ]}
                >
                    {description}
                </ThemedText>
            </ThemedView>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        borderRadius: 10,
        borderWidth: 2,
    },
    name: {
        fontSize: 18,
        fontWeight: "bold",
    },
    theme: {
        fontSize: 14,
    },
});
