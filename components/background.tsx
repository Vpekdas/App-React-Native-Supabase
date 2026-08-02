import { LinearGradient } from "expo-linear-gradient";

export default function Background({ children }: { children: React.ReactNode }) {
    return (
        <LinearGradient
            colors={["#071A13", "#0A3D2C", "#0E9F6E"]}
            start={{ x: 0, y: 0 }}
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
