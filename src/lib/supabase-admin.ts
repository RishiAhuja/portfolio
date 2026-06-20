import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let adminClient: SupabaseClient | null = null;

const getSupabaseAdminConfig = () => {
  const url =
    import.meta.env.SUPABASE_URL ||
    import.meta.env.PUBLIC_SUPABASE_URL ||
    '';

  const secretKey =
    import.meta.env.SUPABASE_SECRET_KEY ||
    import.meta.env.SUPABASE_SERVICE_ROLE_KEY ||
    '';

  return { url, secretKey };
};

/** Server-only Supabase client (service role). Never import from client components. */
export const getSupabaseAdmin = (): SupabaseClient => {
  if (adminClient) {
    return adminClient;
  }

  const { url, secretKey } = getSupabaseAdminConfig();

  if (!url || !secretKey) {
    throw new Error('Missing SUPABASE_URL and SUPABASE_SECRET_KEY for server-side Supabase access.');
  }

  adminClient = createClient(url, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
};
