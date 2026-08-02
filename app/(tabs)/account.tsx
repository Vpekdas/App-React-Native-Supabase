import DeleteAccountButton from "@/components/buttons/delete-account-button";
import SignOutButton from "@/components/buttons/sign-out-button";
import ThemedItem from "@/components/item/themed-item";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useAuthContext } from "@/hooks/use-auth-context";
import { StyleSheet, useColorScheme } from "react-native";

export default function Account() {
    const { isAdmin, profile } = useAuthContext();

    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    const isAccountant = profile?.user_type === "chartered_accountant";

    return (
        <ThemedView
            style={[
                styles.container,
                {
                    backgroundColor: colors.background,
                },
            ]}
        >
            <ThemedView style={styles.header}>
                <ThemedText
                    style={[
                        styles.title,
                        {
                            color: colors.primary,
                        },
                    ]}
                >
                    Compte
                </ThemedText>

                <ThemedText
                    style={[
                        styles.subtitle,
                        {
                            color: colors.textSecondary,
                        },
                    ]}
                >
                    Gérez votre profil et vos préférences.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.profileCard}>
                <ThemedText
                    style={[
                        styles.name,
                        {
                            color: colors.primary,
                        },
                    ]}
                >
                    {profile?.first_name} {profile?.last_name}
                </ThemedText>

                <ThemedText
                    style={[
                        styles.role,
                        {
                            color: colors.textSecondary,
                        },
                    ]}
                >
                    {isAccountant ? "Expert-comptable" : "Étudiant"}
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.itemContainer}>
                <ThemedItem href="/change-password" label="Mot de passe" icon="lock-closed-outline" />

                <ThemedItem href="/resume" label="CV" icon="document-text-outline" />

                {isAccountant && <ThemedItem href="/availability" label="Disponibilité" icon="calendar-outline" />}

                {isAdmin && <ThemedItem href="/admin" label="Administrateur" icon="shield-checkmark-outline" />}
            </ThemedView>

            <ThemedView style={styles.footer}>
                <SignOutButton />
                <DeleteAccountButton />
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 28,
    },

    header: {
        marginBottom: 28,
    },

    title: {
        fontFamily: Fonts.serifBold,
        fontSize: 36,
        lineHeight: 44,
        marginBottom: 8,
    },

    subtitle: {
        fontFamily: Fonts.sans,
        fontSize: 16,
        lineHeight: 24,
    },

    profileCard: {
        padding: 20,
        borderRadius: 18,
        marginBottom: 24,
    },

    name: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 20,
        marginBottom: 6,
    },

    role: {
        fontFamily: Fonts.sans,
        fontSize: 15,
    },

    itemContainer: {
        flex: 1,
        gap: 12,
    },

    footer: {
        marginTop: 20,
        paddingBottom: 20,
        width: "100%",
    },
});
