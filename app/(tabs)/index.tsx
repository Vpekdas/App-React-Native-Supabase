import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import ThemedMeetingCard from "@/components/card/themed-meeting-card";
import { ThemedCard } from "@/components/card/themed-section-card";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import ThemedPopup from "@/components/popup/themed-popup";
import SectionBlock from "@/components/section/section-block";
import { ThemedText } from "@/components/text/themed-text";
import { ThemedView } from "@/components/view/themed-view";
import { Colors, Fonts } from "@/constants/theme";
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { useColorScheme } from "react-native";
import { Meeting } from "./meeting";

export default function HomeScreen() {
    const { profile } = useAuthContext();
    const colorScheme = useColorScheme() ?? "light";
    const colors = Colors[colorScheme];

    const [nextMeeting, setNextMeeting] = useState<Meeting | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const fetchNextMeeting = async () => {
        if (!profile?.id) return;

        const { data } = await supabase
            .from("meetings")
            .select(
                `
                id,
                student_topic,
                accountant_topic,
                starts_at,
                ends_at,
                room_name,
                student:student_id (
                    first_name,
                    last_name
                )
            `,
            )
            .or(`student_id.eq.${profile.id},accountant_id.eq.${profile.id}`)
            .gte("starts_at", new Date().toISOString())
            .order("starts_at", { ascending: true })
            .limit(1)
            .maybeSingle();

        setNextMeeting(data as Meeting);
    };

    useEffect(() => {
        fetchNextMeeting();
    }, [profile?.id]);

    useEffect(() => {
        if (!profile?.id) return;
        setShowPopup(!profile.accepted_terms);
    }, [profile]);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{
                light: colors.mist,
                dark: colors.background,
            }}
            headerImage={
                <Image source={require("@/assets/images/partial-react-logo.png")} style={styles.headerImage} />
            }
        >
            <ThemedView style={styles.hero}>
                <ThemedText style={[styles.welcome, { color: colors.primary }]}>
                    Bienvenue {profile?.first_name} 👋
                </ThemedText>

                <ThemedText style={[styles.subtitle, { color: colors.textSecondary }]}>
                    Continuons à progresser aujourd'hui.
                </ThemedText>
            </ThemedView>

            <ThemedView style={styles.section}>
                <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>Votre sujet</ThemedText>

                <ThemedText style={[styles.value, { color: colors.text }]}>{profile?.topic}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.section}>
                <ThemedText style={[styles.sectionTitle, { color: colors.primary }]}>Prochain rendez-vous</ThemedText>

                {nextMeeting ? (
                    <ThemedMeetingCard
                        topic={nextMeeting.student_topic + " → " + nextMeeting.accountant_topic}
                        studentName={`${nextMeeting.student.first_name} ${nextMeeting.student.last_name}`}
                        startsAt={nextMeeting.starts_at}
                        endsAt={nextMeeting.ends_at}
                        roomName={nextMeeting.room_name}
                    />
                ) : (
                    <ThemedText
                        style={{
                            color: colors.textSecondary,
                        }}
                    >
                        Aucun rendez-vous à venir
                    </ThemedText>
                )}
            </ThemedView>

            <SectionBlock
                title="Conseils"
                description="De petites améliorations qui rendent votre expérience meilleure"
            >
                <ThemedCard
                    title="Disponibilité"
                    description="Gardez vos disponibilités à jour afin que les autres puissent facilement planifier des rendez-vous."
                />

                <ThemedCard title="CV" description="Gardez votre CV à jour pour améliorer vos opportunités." />
            </SectionBlock>

            <ThemedPopup
                visible={showPopup}
                title="Conditions générales"
                content="Votre long texte des conditions ici..."
                accepted={accepted}
                onToggleAccepted={() => setAccepted(!accepted)}
                onAccept={async () => {
                    await supabase.from("profiles").update({ accepted_terms: true }).eq("id", profile?.id);

                    setShowPopup(false);
                }}
            />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    hero: {
        marginBottom: 32,
    },

    welcome: {
        fontFamily: Fonts.serifBold,
        fontSize: 36,
        lineHeight: 44,
    },

    subtitle: {
        fontFamily: Fonts.sans,
        fontSize: 16,
        marginTop: 8,
    },

    section: {
        marginBottom: 28,
        gap: 10,
    },

    sectionTitle: {
        fontFamily: Fonts.sansSemiBold,
        fontSize: 20,
    },

    value: {
        fontFamily: Fonts.sans,
        fontSize: 17,
    },

    headerImage: {
        height: 180,
        width: 300,
        opacity: 0.15,
        right: 0,
        bottom: 0,
        position: "absolute",
    },
});
