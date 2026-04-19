import { Image } from "expo-image";
import { StyleSheet } from "react-native";

import SignOutButton from "@/components/buttons/sign-out-button";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuthContext } from "@/hooks/use-auth-context";

export default function HomeScreen() {
    const { profile, isLoading } = useAuthContext();

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={<Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome!</ThemedText>
            </ThemedView>

            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Username</ThemedText>
                <ThemedText>{profile?.first_name}</ThemedText>

                <ThemedText type="subtitle">Full name</ThemedText>
                <ThemedText>{profile?.last_name}</ThemedText>

                <ThemedText type="subtitle">Topic</ThemedText>
                <ThemedText>{profile?.topic}</ThemedText>

                <ThemedText type="subtitle">Topic Description</ThemedText>
                <ThemedText>{profile?.topic_description}</ThemedText>
            </ThemedView>

            <SignOutButton />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
