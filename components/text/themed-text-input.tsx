import { ThemedText } from "@/components/text/themed-text";
import { useThemeColor } from "@/hooks/use-theme-color";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    lightColor?: string;
    darkColor?: string;
    label?: string;
    error?: string;
    viewStyle?: ViewStyle;
};

export function ThemedTextInput({
    style,
    lightColor,
    darkColor,
    label,
    error,
    viewStyle,
    ...rest
}: ThemedTextInputProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, "background");
    const borderColor = useThemeColor({ light: lightColor, dark: darkColor }, "border");

    return (
        <View style={viewStyle}>
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
    input: {
        borderWidth: 2,
        borderRadius: 8,
        marginTop: 6,
    },
    error: {
        color: "red",
        marginTop: 4,
        fontSize: 12,
    },
});
