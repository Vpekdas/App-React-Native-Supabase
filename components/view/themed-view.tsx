import { Colors } from "@/constants/theme";
import { useColorScheme, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";

type ThemedViewProps = ViewProps & {
    withBackground?: boolean;
    withBorderColor?: boolean;
    style?: StyleProp<ViewStyle>;
};

export function ThemedView({ style, withBackground = false, withBorderColor = false, ...otherProps }: ThemedViewProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <View
            style={[
                withBackground ? { backgroundColor: theme.background } : null,
                withBorderColor ? { borderColor: theme.border } : null,
                style,
            ]}
            {...otherProps}
        />
    );
}
