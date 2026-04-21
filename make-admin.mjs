import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://sfcjqhanjvvvsgypqgcu.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "1b762807-8d60-4626-9ce6-d0f2a598ebaf";

if (!SERVICE_ROLE_KEY) {
    throw new Error("Missing env SUPABASE_SERVICE_ROLE_KEY");
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const { data: got, error: getErr } = await admin.auth.admin.getUserById(USER_ID);
if (getErr) throw getErr;

const current = got.user.app_metadata ?? {};

const { data, error } = await admin.auth.admin.updateUserById(USER_ID, {
    app_metadata: { ...current, is_admin: true },
});
if (error) throw error;

console.log("Updated app_metadata:", data.user.app_metadata);
