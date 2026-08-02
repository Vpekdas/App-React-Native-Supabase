import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "https://www.App-React-Native-Supabase.fr",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
};

interface MeetingRequest {
    accountantId: string;
    studentId: string;
    startsAt: string;
    endsAt: string;
}

Deno.serve(async (req) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

        const admin = createClient(supabaseUrl, serviceRoleKey);
        const body: MeetingRequest = await req.json();

        const { data: student } = await admin
            .from("profiles")
            .select("topic, topic_description")
            .eq("id", body.studentId)
            .single();

        const { data: accountant } = await admin
            .from("profiles")
            .select("topic, topic_description")
            .eq("id", body.accountantId)
            .single();

        if (!student || !accountant) {
            return new Response(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: corsHeaders,
            });
        }

        if (!body.accountantId || !body.startsAt || !body.endsAt) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const { data, error } = await admin
            .from("meetings")
            .insert({
                room_name: crypto.randomUUID(),
                student_id: body.studentId,
                accountant_id: body.accountantId,

                student_topic: student.topic,
                student_topic_description: student.topic_description,

                accountant_topic: accountant.topic,
                accountant_topic_description: accountant.topic_description,

                starts_at: body.startsAt,
                ends_at: body.endsAt,

                status: "scheduled",
            })
            .select()
            .single();

        if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
                status: 400,
                headers: corsHeaders,
            });
        }

        const meetingLink = `https://meet.jit.si/${data.room_name}`;

        return new Response(JSON.stringify({ meeting: data, meetingLink }), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: String(err) }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
