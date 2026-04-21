import { AuthContext } from "@/hooks/use-auth-context";
import { supabase } from "@/lib/supabase";
import { PropsWithChildren, useEffect, useState } from "react";

export default function AuthProvider({ children }: PropsWithChildren) {
    const [claims, setClaims] = useState<Record<string, any> | undefined | null>();
    const [profile, setProfile] = useState<any>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isRecoveryMode, setIsRecoveryMode] = useState(false);

    // Fetch the claims once, and subscribe to auth state changes
    useEffect(() => {
        const fetchClaims = async () => {
            setIsLoading(true);

            const { data, error } = await supabase.auth.getSession();
            setClaims(data?.session?.user ?? null);

            if (error) {
                console.error("Error fetching claims:", error);
            }

            setIsLoading(false);
        };

        fetchClaims();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            console.log("Auth state changed:", _event);
            setClaims(session?.user ?? null);
        });

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    // Fetch the profile when the claims change
    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);

            if (claims) {
                const { data } = await supabase.from("profiles").select("*").eq("id", claims.id).single();

                setProfile(data);
            } else {
                setProfile(null);
            }

            setIsLoading(false);
        };

        fetchProfile();
    }, [claims]);

    const isAdmin = claims?.app_metadata?.is_admin === true;
    const authUserType = (claims?.app_metadata?.user_type as "student" | "chartered_accountant" | undefined) ?? null;

    return (
        <AuthContext.Provider
            value={{
                claims,
                isLoading,
                profile,
                isLoggedIn: !!claims,
                isAdmin,
                authUserType,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
