import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const SUPABASE_URL = "https://sfcjqhanjvvvsgypqgcu.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const USER_ID = "0e781e00-bdc0-4d69-9950-ba02f3fdaaf2";

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
