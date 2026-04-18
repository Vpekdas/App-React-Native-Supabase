import { Colors } from "@/constants/theme";
import { StyleSheet, Text, TextStyle, TouchableOpacity, useColorScheme, ViewStyle } from "react-native";

export type ThemedButtonProps = {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function ThemedButton({ title, onPress, style, textStyle }: ThemedButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.button, { backgroundColor: theme.tint, borderColor: theme.border }, style]}
        >
            <Text style={[styles.text, { color: theme.text }, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        fontWeight: "600",
    },
});
