// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
});