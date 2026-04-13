import { useThemeColor } from "@/hooks/use-theme-color";
import { Picker, PickerProps } from "@react-native-picker/picker";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../text/themed-text";

type ThemedPickerProps = PickerProps & {
    label?: string;
    lightColor?: string;
    darkColor?: string;
};

export function ThemedPicker({ label, lightColor, darkColor, style, ...rest }: ThemedPickerProps) {
    const textColor = useThemeColor({ light: lightColor, dark: darkColor }, "text");
    const backgroundColor = useThemeColor({}, "background");
    const borderColor = useThemeColor({}, "border");

    return (
        <View style={styles.wrapper}>
            {label && <ThemedText type="defaultSemiBold">{label}</ThemedText>}

            <View style={[styles.container, { backgroundColor, borderColor }]}>
                <Picker dropdownIconColor={textColor} style={[{ color: textColor }, style]} {...rest} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 12,
    },
    container: {
        borderRadius: 8,
        borderWidth: 1,
    },
    label: {
        marginBottom: 6,
        fontSize: 14,
        fontWeight: "500",
    },
});
