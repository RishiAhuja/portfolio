import { supabase } from './supabase';

export interface UncompiledEntry {
  id: string;
  date: string;
  title: string;
  slug: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  admin_id: string;
  email: string;
  token: string;
}

export interface SideQuest {
  id: string;
  label: string;
  value: number;
  max_value: number;
  sort_order: number;
}

export interface BootcampLecture {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
  slides_url: string | null;
  video_url: string | null;
  additional_resources: { label: string; url: string }[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface BootcampStudent {
  id: string;
  name: string;
  email: string | null;
  college: string | null;
  year_of_study: number | null;
  linkedin_profile: string;
  linkedin_post: string | null;
  github_profile: string | null;
  initials: string;
  learning_takeaway: string | null;
  consent: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

// ─── Auth (browser → server API) ───────────────────────────────────────────

export const adminLogin = async (
  email: string,
  password: string
): Promise<{ token: string; email: string } | null> => {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as { token: string; email: string };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

export const verifyAdminSession = async (token: string): Promise<AdminSession | null> => {
  try {
    const { data, error } = await supabase.rpc('verify_admin_session', {
      p_token: token,
    });

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

export const adminLogout = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// ─── Public reads (anon + RLS / RPC) ───────────────────────────────────────

export const getPublishedEntries = async (): Promise<UncompiledEntry[]> => {
  const { data, error } = await supabase.rpc('get_published_entries');

  if (error) {
    console.error('Error fetching published entries:', error);
    return [];
  }

  return data as UncompiledEntry[];
};

export const getSideQuests = async (): Promise<SideQuest[]> => {
  const { data, error } = await supabase.rpc('get_side_quests');

  if (error) {
    console.error('Error fetching side quests:', error);
    return [];
  }

  return data as SideQuest[];
};

export const getBootcampLectures = async (): Promise<BootcampLecture[]> => {
  const { data, error } = await supabase
    .from('bootcamp_lectures')
    .select('*')
    .eq('is_published', true)
    .order('day_number', { ascending: true });

  if (error) {
    console.error('Error fetching bootcamp lectures:', error);
    return [];
  }

  return data as BootcampLecture[];
};
