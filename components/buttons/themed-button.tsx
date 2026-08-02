import { Colors } from "@/constants/theme";
import { Typography } from "@/constants/typography";
import { useState } from "react";
import { Pressable, StyleProp, StyleSheet, TextStyle, useColorScheme, ViewStyle } from "react-native";
import { ThemedText } from "../text/themed-text";

export type ThemedButtonProps = {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    disabled?: boolean;
};

export default function ThemedButton({ title, onPress, style, textStyle, disabled = false }: ThemedButtonProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    const [hovered, setHovered] = useState(false);

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            onHoverIn={() => setHovered(true)}
            onHoverOut={() => setHovered(false)}
            style={({ pressed }) => [
                styles.button,
                {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                    opacity: disabled ? 0.55 : pressed ? 0.8 : 1,
                    transform: [
                        {
                            scale: pressed ? 0.96 : hovered ? 1.03 : 1,
                        },
                    ],
                    shadowColor: hovered ? theme.primary : "transparent",
                    shadowOpacity: hovered ? 0.25 : 0,
                    shadowRadius: hovered ? 8 : 0,
                    shadowOffset: {
                        width: 0,
                        height: hovered ? 4 : 0,
                    },
                    elevation: hovered ? 4 : 0,
                },
                style,
            ]}
        >
            <ThemedText style={[styles.text, { color: theme.surface }, textStyle]}>{title}</ThemedText>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        minHeight: 44,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 999,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },

    text: {
        ...Typography.button,
        includeFontPadding: false,
    },
});
