// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_PROXY_URL ||   // https://db.rishia.in  (Cloudflare Worker)
  import.meta.env.PUBLIC_SUPABASE_URL ||          
  'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Standard Supabase client for most operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Special client for operations that need to bypass caching
// Use this for view counts and other real-time data
export const noCacheSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      // Custom fetch implementation that disables caching
      fetch: (...args) => {
        const [url, config] = args;
        return fetch(url, {
          ...config,
          cache: 'no-store',
          headers: {
            ...config?.headers,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });
      }
    }
  }
);