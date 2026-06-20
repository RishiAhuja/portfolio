/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly NEXT_PUBLIC_SUPABASE_URL: string;
  readonly NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly PUBLIC_SUPABASE_PROXY_URL?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_SECRET_KEY?: string;
  readonly SUPABASE_SERVICE_ROLE_KEY?: string;
  readonly CLUSTER_PROGRESS_TOKEN?: string;
  readonly R2_ACCOUNT_ID: string;
  readonly R2_ACCESS_KEY_ID: string;
  readonly R2_SECRET_ACCESS_KEY: string;
  readonly R2_ENDPOINT: string;
  readonly R2_BUCKET_NAME: string;
  readonly PUBLIC_R2_PUBLIC_URL: string;
  readonly PUBLIC_HASHNODE_USERNAME: string;
  readonly HASHNODE_PERSONAL_ACCESS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
