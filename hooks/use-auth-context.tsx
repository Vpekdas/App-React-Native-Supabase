import { createContext, useContext } from "react";

export type UserProfile = {
    id: string;
    first_name: string;
    last_name: string;
    education_year: number;
    user_type: "student" | "chartered_accountant";
    topic: string[];
    topic_description: string;
};

export type AuthData = {
    claims?: Record<string, any> | null;
    profile?: UserProfile | null;
    isLoading: boolean;
    isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthData>({
    claims: undefined,
    profile: undefined,
    isLoading: true,
    isLoggedIn: false,
});

export const useAuthContext = () => useContext(AuthContext);
