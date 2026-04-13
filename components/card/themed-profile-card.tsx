import { useThemeColor } from "@/hooks/use-theme-color";
import { StyleSheet } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../themed-view";

export type ProfileProps = {
    name: string;
    theme: string;
    lightColor?: string;
    darkColor?: string;
};

export default function ThemedProfileCard({ name, theme, lightColor, darkColor }: ProfileProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "border");
    const tintColor = useThemeColor({ light: lightColor, dark: darkColor }, "tint");

    return (
        <ThemedView
            style={[
                {
                    borderColor: borderColor,
                    backgroundColor: backgroundColor,
                },
                styles.container,
            ]}
        >
            <ThemedText
                style={[
                    styles.name,
                    {
                        color: textColor,
                        backgroundColor: backgroundColor,
                    },
                ]}
            >
                {name}
            </ThemedText>
            <ThemedText
                style={[
                    styles.theme,
                    {
                        color: textColor,
                        backgroundColor: backgroundColor,
                    },
                ]}
            >
                {theme}
            </ThemedText>
        </ThemedView>
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
