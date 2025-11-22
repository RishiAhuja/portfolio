-- Create uncompiled_entries table
CREATE TABLE IF NOT EXISTS uncompiled_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date TEXT NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table for authentication
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE uncompiled_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Public can read published entries
CREATE POLICY "Public can read published entries"
  ON uncompiled_entries FOR SELECT
  USING (published = true);

-- Admin policies (you'll need to create admin role or use service role)
CREATE POLICY "Admins can do everything with entries"
  ON uncompiled_entries FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can read their own data"
  ON admin_users FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can manage sessions"
  ON admin_sessions FOR ALL
  USING (auth.role() = 'service_role');

-- Function to get published entries
CREATE OR REPLACE FUNCTION get_published_entries()
RETURNS TABLE (
  id UUID,
  date TEXT,
  title TEXT,
  slug TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.date,
    e.title,
    e.slug,
    e.content,
    e.created_at,
    e.updated_at
  FROM uncompiled_entries e
  WHERE e.published = true
  ORDER BY e.created_at DESC;
END;
$$;

-- Function to verify admin session
CREATE OR REPLACE FUNCTION verify_admin_session(p_token TEXT)
RETURNS TABLE (
  admin_id UUID,
  email TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email
  FROM admin_sessions asess
  JOIN admin_users au ON au.id = asess.admin_id
  WHERE asess.token = p_token
    AND asess.expires_at > NOW();
END;
$$;

-- Insert initial admin user (you'll need to hash the password properly)
-- This is just a placeholder - use a proper password hashing library
-- For now, you can manually insert after hashing with bcrypt
-- Example: INSERT INTO admin_users (email, password_hash) VALUES ('your@email.com', 'bcrypt_hashed_password');

-- Create indexes for better performance
CREATE INDEX idx_uncompiled_published ON uncompiled_entries(published);
CREATE INDEX idx_uncompiled_slug ON uncompiled_entries(slug);
CREATE INDEX idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
