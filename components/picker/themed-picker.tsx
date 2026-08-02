import { Typography } from "@/constants/typography";
import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker, type PickerProps } from "@react-native-picker/picker";
import { Platform, StyleSheet } from "react-native";
import { ThemedText } from "../text/themed-text";
import { ThemedView } from "../view/themed-view";

type ThemedPickerProps = PickerProps & {
    label?: string;
    lightColor?: string;
    darkColor?: string;
};

export function ThemedPicker({ label, lightColor, darkColor, style, ...rest }: ThemedPickerProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const labelColor = useThemeColor({}, "textSecondary");
    const backgroundColor = useThemeColor({}, "surface");
    const borderColor = useThemeColor({}, "border");

    return (
        <ThemedView style={styles.wrapper}>
            {label ? <ThemedText style={[styles.label, { color: labelColor }]}>{label}</ThemedText> : null}

            <ThemedView style={[styles.container, { backgroundColor, borderColor }]}>
                <Picker dropdownIconColor={textColor} style={[styles.picker, { color: textColor }, style]} {...rest} />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 12,
    },

    label: {
        ...Typography.bodyMedium,
        fontSize: 13.5,
        lineHeight: 18,
        marginBottom: 8,
        includeFontPadding: false,
    },

    container: {
        borderRadius: 12,
        borderWidth: 1,
        overflow: "hidden",
        minHeight: 48,
        justifyContent: "center",
    },

    picker: {
        ...(Platform.OS === "android" ? { height: 48 } : { height: 44 }),
    },
});
