import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:8081",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

Deno.serve(async (req) => {
    try {
        if (req.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        if (req.method !== "GET" && req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
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
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                },
            );
        }

        const authHeader = req.headers.get("Authorization") ?? "";

        const userClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: authHeader } },
        });

        const { data: userData, error: userErr } = await userClient.auth.getUser();
        if (userErr || !userData?.user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (userData.user.app_metadata?.is_admin !== true) {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const admin = createClient(supabaseUrl, serviceRoleKey);

        const { data, error } = await admin
            .from("profiles")
            .select("id, first_name, last_name, education_year, requested_user_type, topic, topic_description")
            .eq("requested_user_type", "chartered_accountant")
            .order("last_name", { ascending: true });

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ data: data ?? [] }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
