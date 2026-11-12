import bcrypt from 'bcryptjs';
import type { AdminSession } from './admin';
import { getSupabaseAdmin } from './supabase-admin';

const generateToken = () =>
  `${Date.now()}_${Math.random().toString(36).substring(2)}_${Math.random().toString(36).substring(2)}`;

export const verifyAdminSessionServer = async (token: string): Promise<AdminSession | null> => {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.rpc('verify_admin_session', { p_token: token });

    if (error || !data || data.length === 0) {
      return null;
    }

    return {
      admin_id: data[0].admin_id,
      email: data[0].email,
      token,
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};

export const loginAdminServer = async (
  email: string,
  password: string
): Promise<{ token: string; email: string } | null> => {
  const supabase = getSupabaseAdmin();

  const { data: admin, error: adminError } = await supabase
    .from('admin_users')
    .select('id, email, password_hash')
    .eq('email', email)
    .single();

  if (adminError || !admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password_hash);
  if (!isValid) {
    return null;
  }

  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const { error: sessionError } = await supabase.from('admin_sessions').insert({
    admin_id: admin.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  if (sessionError) {
    console.error('Error creating session:', sessionError);
    return null;
  }

  return { token, email: admin.email };
};

export const logoutAdminServer = async (token: string): Promise<boolean> => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('admin_sessions').delete().eq('token', token);
  return !error;
};
