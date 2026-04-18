import { LinearGradient } from "expo-linear-gradient";

export default function Background({ children }: { children: React.ReactNode }) {
    return (
        <LinearGradient
            colors={["#006D77", "#83C5BE", "#FFDDD2"]}
            start={{ x: 0.2, y: 0.2 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <LinearGradient
                colors={["rgba(255,255,255,0.10)", "transparent"]}
                style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                }}
            />

            {children}
        </LinearGradient>
    );
}
