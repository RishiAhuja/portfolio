import bcrypt from 'bcryptjs';
import type {
  AdminSession,
  BootcampLecture,
  BootcampStudent,
  SideQuest,
  SideQuestWithHistory,
  UncompiledEntry,
  UpstreamOverrideAdmin,
} from './admin';
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

export const listUncompiledEntriesServer = async (): Promise<UncompiledEntry[]> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('uncompiled_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching entries:', error);
    return [];
  }

  return data as UncompiledEntry[];
};

export const createUncompiledEntryServer = async (
  entry: Omit<UncompiledEntry, 'id' | 'created_at' | 'updated_at'>
): Promise<UncompiledEntry | null> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('uncompiled_entries')
    .insert({
      date: entry.date,
      title: entry.title,
      slug: entry.slug,
      content: entry.content,
      published: entry.published,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating entry:', error);
    return null;
  }

  return data as UncompiledEntry;
};

export const updateUncompiledEntryServer = async (
  id: string,
  updates: Partial<Omit<UncompiledEntry, 'id' | 'created_at'>>
): Promise<UncompiledEntry | null> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('uncompiled_entries')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating entry:', error);
    return null;
  }

  return data as UncompiledEntry;
};

export const deleteUncompiledEntryServer = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('uncompiled_entries').delete().eq('id', id);
  return !error;
};

export const updateSideQuestServer = async (
  id: string,
  updates: Partial<Omit<SideQuest, 'id'>>
): Promise<SideQuest | null> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('side_quests')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating side quest:', error);
    return null;
  }

  if (updates.value !== undefined || updates.max_value !== undefined) {
    await supabase.from('side_quests_history').insert({
      side_quest_id: id,
      value: data.value,
      max_value: data.max_value,
    });
  }

  return data as SideQuest;
};

export const listBootcampLecturesServer = async (): Promise<BootcampLecture[]> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('bootcamp_lectures')
    .select('*')
    .order('day_number', { ascending: true });

  if (error) {
    console.error('Error fetching bootcamp lectures:', error);
    return [];
  }

  return data as BootcampLecture[];
};

export const updateBootcampLectureServer = async (
  id: string,
  updates: Partial<Omit<BootcampLecture, 'id' | 'created_at' | 'updated_at'>>
): Promise<BootcampLecture | null> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('bootcamp_lectures')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating bootcamp lecture:', error);
    return null;
  }

  return data as BootcampLecture;
};

export const listBootcampStudentsServer = async (
  status?: 'pending' | 'approved' | 'rejected'
): Promise<BootcampStudent[]> => {
  const supabase = getSupabaseAdmin();
  let query = supabase.from('bootcamp_students').select('*').order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching bootcamp students:', error);
    return [];
  }

  return data as BootcampStudent[];
};

export const updateBootcampStudentStatusServer = async (
  id: string,
  status: 'approved' | 'rejected'
): Promise<boolean> => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('bootcamp_students')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  return !error;
};

export const deleteBootcampStudentServer = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('bootcamp_students').delete().eq('id', id);
  return !error;
};

export const listUpstreamOverridesServer = async (): Promise<UpstreamOverrideAdmin[]> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('upstream_overrides')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching upstream overrides:', error);
    return [];
  }

  return data as UpstreamOverrideAdmin[];
};

export const upsertUpstreamOverrideServer = async (
  override: Omit<UpstreamOverrideAdmin, 'id' | 'created_at' | 'updated_at'>
): Promise<UpstreamOverrideAdmin | null> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('upstream_overrides')
    .upsert({ ...override, updated_at: new Date().toISOString() }, { onConflict: 'pr_url' })
    .select()
    .single();

  if (error) {
    console.error('Error upserting upstream override:', error);
    return null;
  }

  return data as UpstreamOverrideAdmin;
};

export const deleteUpstreamOverrideServer = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('upstream_overrides').delete().eq('id', id);
  return !error;
};

export const getSideQuestsWithHistoryServer = async (): Promise<SideQuestWithHistory[]> => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.rpc('get_side_quests_with_history');

  if (error) {
    console.error('Error fetching side quests with history:', error);
    return [];
  }

  return data as SideQuestWithHistory[];
};
