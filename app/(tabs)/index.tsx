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
import { useAuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { Meeting } from "./meeting";

export default function HomeScreen() {
    const { profile } = useAuthContext();

    const [nextMeeting, setNextMeeting] = useState<Meeting | null>(null);
    const [showPopup, setShowPopup] = useState(false);
    const [accepted, setAccepted] = useState(false);

    const fetchNextMeeting = async () => {
        if (!profile?.id) return;

        const { data, error } = await supabase
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

        if (error) {
            return;
        }

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
            headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
            headerImage={<Image source={require("@/assets/images/partial-react-logo.png")} style={styles.reactLogo} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Welcome {profile?.first_name} 👋</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Your topic</ThemedText>
                <ThemedText>{profile?.topic}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Next meeting</ThemedText>

                {nextMeeting ? (
                    <ThemedMeetingCard
                        topic={nextMeeting.student_topic + " -> " + nextMeeting.accountant_topic}
                        studentName={`${nextMeeting.student.first_name} ${nextMeeting.student.last_name}`}
                        startsAt={nextMeeting.starts_at}
                        endsAt={nextMeeting.ends_at}
                        roomName={nextMeeting.room_name}
                    />
                ) : (
                    <ThemedText>No upcoming meetings</ThemedText>
                )}
            </ThemedView>

            <ThemedPopup
                visible={showPopup}
                title="Terms and Conditions"
                content="Your long terms text here..."
                accepted={accepted}
                onToggleAccepted={() => setAccepted(!accepted)}
                onAccept={async () => {
                    await supabase.from("profiles").update({ accepted_terms: true }).eq("id", profile?.id);

                    setShowPopup(false);
                }}
            />

            <SectionBlock title="Tips" description="Here is what you can do to improve your experience">
                <ThemedCard
                    title="Availability"
                    description="Don't forget to keep updated your availability on account section."
                />
                <ThemedCard
                    title="Resume"
                    description="For improving research for chartered accountant, keep your resume updated."
                />
            </SectionBlock>
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
        marginBottom: 16,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
