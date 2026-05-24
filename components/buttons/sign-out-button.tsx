import ThemedButton from "@/components/buttons/themed-button";
import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useColorScheme } from "react-native";

async function onSignOutButtonPress() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Error signing out:", error);
    }
}

export default function SignOutButton() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? "light"];

    return (
        <ThemedButton title="Sign out" onPress={onSignOutButtonPress} style={{ backgroundColor: theme.destructive }} />
    );
}
