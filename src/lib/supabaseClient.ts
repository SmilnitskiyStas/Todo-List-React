import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw new Error('Missing VITE_SUPABASE_URL environment variable');
}
if (!supabaseAnonKey) {
    throw new Error('Missing VITE_SUPABASE_ANON_KEY environmet variable');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log("Supabase client initialized with URL:", supabaseUrl);