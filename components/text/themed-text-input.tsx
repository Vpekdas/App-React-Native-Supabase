import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, useColorScheme, View, ViewStyle } from "react-native";

export type ThemedTextInputProps = TextInputProps & {
    label?: string;
    error?: string;
    viewStyle?: ViewStyle;
};

export function ThemedTextInput({ style, label, error, viewStyle, ...rest }: ThemedTextInputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <View style={viewStyle}>
            {label && <ThemedText type="defaultSemiBold">{label}</ThemedText>}

            <TextInput
                style={[
                    styles.input,
                    {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                    },
                    style,
                ]}
                placeholderTextColor={theme.text + "80"}
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
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    error: {
        color: "red",
        marginTop: 4,
        fontSize: 12,
    },
});
