import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a browser-side Supabase client instance.
 * Uses environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * Falls back safely if environment variables are not set yet during development.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
