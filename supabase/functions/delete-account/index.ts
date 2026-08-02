import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.App-React-Native-Supabase.fr",
    "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
    try {
        if (req.method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: corsHeaders,
            });
        }

        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({
                    error: "Method not allowed",
                }),
                {
                    status: 405,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const supabaseUrl = Deno.env.get("SUPABASE_URL");
        const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

        if (!supabaseUrl || !anonKey || !serviceRoleKey) {
            return new Response(
                JSON.stringify({
                    error: "Missing env vars",
                    missing: {
                        SUPABASE_URL: !supabaseUrl,
                        SUPABASE_ANON_KEY: !anonKey,
                        SUPABASE_SERVICE_ROLE_KEY: !serviceRoleKey,
                    },
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const authHeader = req.headers.get("Authorization") ?? "";

        // Client using the user's session
        const userClient = createClient(
            supabaseUrl,
            anonKey,
            {
                global: {
                    headers: {
                        Authorization: authHeader,
                    },
                },
            },
        );

        const {
            data: userData,
            error: userError,
        } = await userClient.auth.getUser();


        if (userError || !userData.user) {
            return new Response(
                JSON.stringify({
                    error: "Unauthorized",
                }),
                {
                    status: 401,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }


        const userId = userData.user.id;


        // Admin client
        const admin = createClient(
            supabaseUrl,
            serviceRoleKey,
        );


        /*
            This deletes auth.users row.

            Your database cascades:
            
            auth.users
              -> profiles
              -> resume_meta
              -> availability_rules
              -> meetings
              -> accountant_public

            But storage files need manual deletion.
        */


        const { data: resumeFiles, error: storageListError } =
            await admin.storage
                .from("resume")
                .list(userId);


        if (storageListError) {
            return new Response(
                JSON.stringify({
                    error: storageListError.message,
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }


        if (resumeFiles && resumeFiles.length > 0) {
            const paths = resumeFiles.map(
                (file) => `${userId}/${file.name}`,
            );

            const { error: removeError } =
                await admin.storage
                    .from("resume")
                    .remove(paths);

            if (removeError) {
                return new Response(
                    JSON.stringify({
                        error: removeError.message,
                    }),
                    {
                        status: 500,
                        headers: {
                            ...corsHeaders,
                            "Content-Type": "application/json",
                        },
                    },
                );
            }
        }


        const { error: deleteError } =
            await admin.auth.admin.deleteUser(userId);


        if (deleteError) {
            return new Response(
                JSON.stringify({
                    error: deleteError.message,
                }),
                {
                    status: 500,
                    headers: {
                        ...corsHeaders,
                        "Content-Type": "application/json",
                    },
                },
            );
        }


        return new Response(
            JSON.stringify({
                success: true,
            }),
            {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );


    } catch (e) {
        return new Response(
            JSON.stringify({
                error: String(e),
            }),
            {
                status: 500,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/json",
                },
            },
        );
    }
});