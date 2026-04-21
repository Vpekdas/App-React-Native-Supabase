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
    isAdmin: boolean;
    authUserType?: "student" | "chartered_accountant" | null;
};

export const AuthContext = createContext<AuthData>({
    claims: undefined,
    profile: undefined,
    isLoading: true,
    isLoggedIn: false,
    isAdmin: false,
    authUserType: null,
});

export const useAuthContext = () => useContext(AuthContext);
