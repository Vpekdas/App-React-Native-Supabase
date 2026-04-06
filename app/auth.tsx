import { supabase } from "@/lib/supabase";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const createSessionFromUrl = async (url: string) => {
    const { params, errorCode } = QueryParams.getQueryParams(url);

    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token } = params;

    if (!access_token) return null;

    const { data, error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
    });

    if (error) throw error;

    return data.session;
};

export default function Auth() {
    const url = Linking.useLinkingURL();

    useEffect(() => {
        if (!url) {
            console.log("Url undefined !")
            return;
        }

        createSessionFromUrl(url)
            .then((session) => {
                if (session) {
                    console.log("Logged in!");
                }
            })
            .catch(console.error);
    }, [url]);

    return null;
}
