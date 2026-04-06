import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

export type ThemedButtonProps = {
    title: string;
    onPress: () => void;
    lightColor?: string;
    darkColor?: string;
    style?: ViewStyle;
    textStyle?: TextStyle;
};

export default function ThemedButton({ title, onPress, lightColor, darkColor, style, textStyle }: ThemedButtonProps) {
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "border");
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, "tint");
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");


    return (
        <TouchableOpacity onPress={onPress} style={[styles.button, { backgroundColor: tintColor, borderColor }, style]}>
            <Text style={[styles.text, { color: backgroundColor }, textStyle]}>{title}</Text>
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
