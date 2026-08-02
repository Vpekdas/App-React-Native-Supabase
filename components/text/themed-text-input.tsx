import { StyleSheet, TextInput, type TextInputProps, useColorScheme, type ViewStyle } from "react-native";

import { ThemedText } from "@/components/text/themed-text";
import { Colors } from "@/constants/theme";
import { ThemedView } from "../view/themed-view";

export type ThemedTextInputProps = TextInputProps & {
    label?: string;
    error?: string;
    viewStyle?: ViewStyle;
};

export function ThemedTextInput({ style, label, error, viewStyle, ...rest }: ThemedTextInputProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <ThemedView style={viewStyle}>
            {label && (
                <ThemedText type="defaultSemiBold" style={styles.label}>
                    {label}
                </ThemedText>
            )}

            <TextInput
                style={[
                    styles.input,
                    {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.surface,
                    },
                    style,
                ]}
                placeholderTextColor={theme.textMuted}
                {...rest}
            />

            {error && (
                <ThemedText
                    type="default"
                    style={[
                        styles.error,
                        {
                            color: theme.destructive,
                        },
                    ]}
                >
                    {error}
                </ThemedText>
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    label: {
        marginBottom: 6,
    },

    input: {
        borderWidth: 1.5,
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
    },

    error: {
        marginTop: 4,
        fontSize: 12,
    },
});
