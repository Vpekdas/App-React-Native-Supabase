import { useColorScheme, View, type ViewProps } from "react-native";

import { Colors } from "@/constants/theme";

export function ThemedView({ style, ...otherProps }: ViewProps) {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return <View style={[{ backgroundColor: theme.background, borderColor: theme.border }, style]} {...otherProps} />;
}
