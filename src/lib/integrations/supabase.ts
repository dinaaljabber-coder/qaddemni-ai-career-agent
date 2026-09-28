/** Server-side Supabase boundary. Configure credentials and add @supabase/ssr before enabling auth/data. */
export function getSupabaseConfig() { return { url: process.env.SUPABASE_URL, anonKey: process.env.SUPABASE_ANON_KEY, serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY, configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) }; }
