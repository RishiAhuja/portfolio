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

export interface SideQuestHistory {
  value: number;
  max_value: number;
  recorded_at: string;
}

export interface SideQuestWithHistory extends SideQuest {
  history: SideQuestHistory[];
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

export interface UpstreamOverrideAdmin {
  id: string;
  pr_url: string;
  item_type: 'pr' | 'issue';
  visible: boolean;
  state_override: 'open' | 'closed' | 'merged' | null;
  title_override: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const adminRequest = async <T>(
  path: string,
  token: string,
  init?: RequestInit
): Promise<T> => {
  const response = await fetch(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(typeof payload.error === 'string' ? payload.error : 'Request failed');
  }

  return payload as T;
};

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

export const verifyAdminToken = async (token: string): Promise<boolean> => {
  const session = await verifyAdminSession(token);
  return session !== null;
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

export const getSideQuestHistory = async (questId: string): Promise<SideQuestHistory[]> => {
  const { data, error } = await supabase.rpc('get_side_quest_history', {
    p_side_quest_id: questId,
  });

  if (error) {
    console.error('Error fetching side quest history:', error);
    return [];
  }

  return data as SideQuestHistory[];
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

// ─── Admin reads/writes (browser → server API) ─────────────────────────────

export const getAllEntries = async (token: string): Promise<UncompiledEntry[]> => {
  const { data } = await adminRequest<{ data: UncompiledEntry[] }>('/api/admin/entries', token);
  return data;
};

export const createEntry = async (
  token: string,
  entry: Omit<UncompiledEntry, 'id' | 'created_at' | 'updated_at'>
): Promise<UncompiledEntry | null> => {
  const { data } = await adminRequest<{ data: UncompiledEntry }>('/api/admin/entries', token, {
    method: 'POST',
    body: JSON.stringify({ action: 'create', entry }),
  });
  return data;
};

export const updateEntry = async (
  token: string,
  id: string,
  updates: Partial<Omit<UncompiledEntry, 'id' | 'created_at'>>
): Promise<UncompiledEntry | null> => {
  const { data } = await adminRequest<{ data: UncompiledEntry }>('/api/admin/entries', token, {
    method: 'POST',
    body: JSON.stringify({ action: 'update', id, updates }),
  });
  return data;
};

export const deleteEntry = async (token: string, id: string): Promise<boolean> => {
  const { success } = await adminRequest<{ success: boolean }>('/api/admin/entries', token, {
    method: 'POST',
    body: JSON.stringify({ action: 'delete', id }),
  });
  return success;
};

export const togglePublishEntry = async (
  token: string,
  id: string,
  published: boolean
): Promise<boolean> => {
  const { success } = await adminRequest<{ success: boolean }>('/api/admin/entries', token, {
    method: 'POST',
    body: JSON.stringify({ action: 'togglePublish', id, published }),
  });
  return success;
};

export const getAllSideQuests = async (token: string): Promise<SideQuest[]> => {
  const { data } = await adminRequest<{ data: SideQuest[] }>('/api/admin/side-quests', token);
  return data;
};

export const updateSideQuest = async (
  token: string,
  id: string,
  updates: Partial<Omit<SideQuest, 'id'>>
): Promise<SideQuest | null> => {
  const { data } = await adminRequest<{ data: SideQuest }>('/api/admin/side-quests', token, {
    method: 'POST',
    body: JSON.stringify({ id, updates }),
  });
  return data;
};

export const getSideQuestsWithHistory = async (token: string): Promise<SideQuestWithHistory[]> => {
  const { data } = await adminRequest<{ data: SideQuestWithHistory[] }>(
    '/api/admin/side-quests?withHistory=1',
    token
  );
  return data;
};

export const getAllBootcampLectures = async (token: string): Promise<BootcampLecture[]> => {
  const { data } = await adminRequest<{ data: BootcampLecture[] }>(
    '/api/admin/bootcamp-lectures',
    token
  );
  return data;
};

export const updateBootcampLecture = async (
  token: string,
  id: string,
  updates: Partial<Omit<BootcampLecture, 'id' | 'created_at' | 'updated_at'>>
): Promise<BootcampLecture | null> => {
  const { data } = await adminRequest<{ data: BootcampLecture }>(
    '/api/admin/bootcamp-lectures',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'update', id, updates }),
    }
  );
  return data;
};

export const togglePublishBootcampLecture = async (
  token: string,
  id: string,
  isPublished: boolean
): Promise<boolean> => {
  const { success } = await adminRequest<{ success: boolean }>(
    '/api/admin/bootcamp-lectures',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'togglePublish', id, isPublished }),
    }
  );
  return success;
};

export const getPendingBootcampStudents = async (token: string): Promise<BootcampStudent[]> => {
  const { data } = await adminRequest<{ data: BootcampStudent[] }>(
    '/api/admin/bootcamp-students?status=pending',
    token
  );
  return data;
};

export const getAllBootcampStudents = async (token: string): Promise<BootcampStudent[]> => {
  const { data } = await adminRequest<{ data: BootcampStudent[] }>(
    '/api/admin/bootcamp-students',
    token
  );
  return data;
};

export const updateBootcampStudentStatus = async (
  token: string,
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  const { success } = await adminRequest<{ success: boolean }>(
    '/api/admin/bootcamp-students',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'updateStatus', id, status }),
    }
  );
  return success;
};

export const deleteBootcampStudent = async (token: string, id: string): Promise<boolean> => {
  const { success } = await adminRequest<{ success: boolean }>(
    '/api/admin/bootcamp-students',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id }),
    }
  );
  return success;
};

export const getUpstreamOverrides = async (token: string): Promise<UpstreamOverrideAdmin[]> => {
  const { data } = await adminRequest<{ data: UpstreamOverrideAdmin[] }>(
    '/api/admin/upstream-overrides',
    token
  );
  return data;
};

export const upsertUpstreamOverride = async (
  token: string,
  override: Omit<UpstreamOverrideAdmin, 'id' | 'created_at' | 'updated_at'>
): Promise<UpstreamOverrideAdmin | null> => {
  const { data } = await adminRequest<{ data: UpstreamOverrideAdmin }>(
    '/api/admin/upstream-overrides',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'upsert', override }),
    }
  );
  return data;
};

export const deleteUpstreamOverride = async (token: string, id: string): Promise<boolean> => {
  const { success } = await adminRequest<{ success: boolean }>(
    '/api/admin/upstream-overrides',
    token,
    {
      method: 'POST',
      body: JSON.stringify({ action: 'delete', id }),
    }
  );
  return success;
};
