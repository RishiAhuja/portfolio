/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force dynamic rendering for specific paths
  experimental: {
    // This ensures project pages are dynamically rendered
    serverComponentsExternalPackages: ['@supabase/supabase-js']
  }
};

export default nextConfig;
