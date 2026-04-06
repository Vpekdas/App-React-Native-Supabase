import { ThemedText } from "@/components/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    label?: string;
    error?: string;
};

export function ThemedTextInput({ style, lightColor, darkColor, label, error, ...rest }: ThemedTextInputProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "border");

    return (
        <View style={styles.container}>
            {label && <ThemedText type="defaultSemiBold">{label}</ThemedText>}

            <TextInput
                style={[
                    styles.input,
                    {
                        color: textColor,
                        borderColor: borderColor,
                        backgroundColor,
                    },
                    style,
                ]}
                placeholderTextColor={textColor + "80"}
                {...rest}
            />

            {error && (
                <ThemedText style={styles.error} type="default">
                    {error}
                </ThemedText>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    input: {
        height: 44,
        borderWidth: 2,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginTop: 6,
    },
    error: {
        color: "red",
        marginTop: 4,
        fontSize: 12,
    },
});
