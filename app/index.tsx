import Background from "@/components/background";
import { ThemedCard } from "@/components/card/themed-section-card";
import SectionBlock from "@/components/section/section-block";
import ThemedHeader from "@/components/header/themed-header";
import ThemedSection from "@/components/themed-section";
import { useRef } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Home() {
    const scrollRef = useRef<ScrollView>(null);
    const sectionPositions = useRef<Record<string, number>>({});

    const registerSection = (id: string, y: number) => {
        sectionPositions.current[id] = y;
    };

    const scrollToSection = (id: string) => {
        const y = sectionPositions.current[id];
        if (y !== undefined) {
            scrollRef.current?.scrollTo({ y, animated: true });
        }
    };

    return (
        <Background>
            <ThemedHeader onNavigate={scrollToSection} />
            <ScrollView ref={scrollRef} contentContainerStyle={{}}>
                <ThemedSection id="Comment ça marche" onMeasure={registerSection}>
                    <SectionBlock title="Comment ça marche" description="Un parcours simple. Un matching sérieux.">
                        <ThemedCard
                            title="Qualification"
                            description="Vous renseignez votre sujet, vos mots-clés et l’angle retenu."
                        />
                        <ThemedCard
                            title="Mise en relation"
                            description="Le matching se fait sur la proximité du sujet (identique ou très proche)."
                        />
                        <ThemedCard
                            title="Session"
                            description="Échange ponctuel centré sur l’expérience : choix, obstacles, enseignements."
                        />
                    </SectionBlock>
                </ThemedSection>
                <ThemedSection id="Thématiques couvertes" onMeasure={registerSection}>
                    <SectionBlock
                        title="Thématiques couvertes"
                        description="Un aperçu des domaines fréquemment traités (à adapter à ton offre)."
                    >
                        <ThemedCard
                            title="Fusion / Acquisition"
                            description="Organisation cabinet, diligences, risques, livrables."
                        />
                        <ThemedCard
                            title="ESG / Durabilité"
                            description="Structuration mission, reporting, posture cabinet."
                        />
                        <ThemedCard title="Associations" description="Gouvernance, contrôles, risques, missions." />
                        <ThemedCard
                            title="Crypto / FinTech"
                            description="Enjeux pratiques, organisation, contrôle interne."
                        />
                    </SectionBlock>
                </ThemedSection>
                <ThemedSection id="Chartes MémoDEC" onMeasure={registerSection}>
                    <SectionBlock title="Chartes MémoDEC" description="Lisibles, synthétiques, orientées pratique.">
                        <ThemedCard
                            title="Charte Mentor"
                            description={
                                "• Le mentor partage un retour d’expérience lié à son mémoire et à sa soutenance.\n" +
                                "• Pas de validation, pas de correction, pas d’accompagnement académique.\n" +
                                "• Aucune garantie de recevabilité, de note ou de réussite.\n" +
                                "• Expression à titre personnel, sans valeur institutionnelle."
                            }
                        />
                        <ThemedCard
                            title="Charte Mémorialiste"
                            description={
                                "• Le mémorialiste utilise le retour d’expérience comme éclairage, non comme directive.\n" +
                                "• Il reste seul responsable du contenu et des choix de son mémoire.\n" +
                                "• Pas de demandes de validation, de relecture ou de correction.\n" +
                                "• L’échange n’a aucune valeur officielle dans le cadre du diplôme."
                            }
                        />
                    </SectionBlock>
                </ThemedSection>
            </ScrollView>
        </Background>
    );
}
