import Background from "@/components/background";
import ThemedHeader from "@/components/header/themed-header";
import { ThemedHero } from "@/components/hero/themed-hero";
import { DecSubjectsMarquee } from "@/components/landing/marquee";
import { ThemedBenefit } from "@/components/landing/themed-benefit";
import { ThemedFooter } from "@/components/landing/themed-footer";
import { ThemedProblem } from "@/components/landing/themed-problem";
import { ThemedQuote } from "@/components/landing/themed-quote";
import { ThemedSolution } from "@/components/landing/themed-solution";
import { ThemedTimeline } from "@/components/landing/themed-timeline";
import { ThemedWhy } from "@/components/landing/themed-why";
import { ThemedView } from "@/components/view/themed-view";
import { useRef } from "react";
import { ScrollView } from "react-native";

export default function Home() {
    const scrollRef = useRef<ScrollView>(null);
    const sectionPositions = useRef<Record<string, number>>({});

    const registerSection = (id: string, y: number) => {
        sectionPositions.current[id] = y;
    };

    const scrollToSection = (id: string) => {
        const y = sectionPositions.current[id];
        if (y !== undefined) {
            scrollRef.current?.scrollTo({ y: Math.max(0, y - 12), animated: true });
        }
    };

    return (
        <Background>
            <ThemedHeader onNavigate={scrollToSection} />

            <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
                <ThemedHero />
                <DecSubjectsMarquee />
                <ThemedBenefit />
                <ThemedProblem />

                <ThemedView onLayout={(e) => registerSection("Fonctionnalités", e.nativeEvent.layout.y)}>
                    <ThemedSolution />
                </ThemedView>

                <ThemedView onLayout={(e) => registerSection("Pourquoi App-React-Native-Supabase", e.nativeEvent.layout.y)}>
                    <ThemedWhy />
                </ThemedView>

                <ThemedView onLayout={(e) => registerSection("Comment ça marche", e.nativeEvent.layout.y)}>
                    <ThemedTimeline />
                </ThemedView>

                <ThemedQuote />
                <ThemedFooter />
            </ScrollView>
        </Background>
    );
}
