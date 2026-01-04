import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

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

// Generate secure random token
const generateToken = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2)}_${Math.random().toString(36).substring(2)}`;
};

// Admin authentication
export const adminLogin = async (email: string, password: string): Promise<{ token: string; email: string } | null> => {
  try {
    // Get admin user
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single();

    if (adminError || !admin) {
      console.error('Admin not found:', adminError);
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, admin.password_hash);
    if (!isValid) {
      console.error('Invalid password');
      return null;
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: admin.id,
        token,
        expires_at: expiresAt.toISOString()
      });

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return null;
    }

    return { token, email: admin.email };
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
};

// Verify admin session
export const verifyAdminSession = async (token: string): Promise<AdminSession | null> => {
  try {
    const { data, error } = await supabase.rpc('verify_admin_session', {
      p_token: token
    });

    if (error || !data || data.length === 0) {
      return null;
    }

    return {
      admin_id: data[0].admin_id,
      email: data[0].email,
      token
    };
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
};

// Logout admin
export const adminLogout = async (token: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('token', token);

    return !error;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
};

// Get all entries (admin only)
export const getAllEntries = async (token: string): Promise<UncompiledEntry[]> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

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

// Get published entries (public)
export const getPublishedEntries = async (): Promise<UncompiledEntry[]> => {
  const { data, error } = await supabase.rpc('get_published_entries');

  if (error) {
    console.error('Error fetching published entries:', error);
    return [];
  }

  return data as UncompiledEntry[];
};

// Create entry (admin only)
export const createEntry = async (
  token: string,
  entry: Omit<UncompiledEntry, 'id' | 'created_at' | 'updated_at'>
): Promise<UncompiledEntry | null> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('uncompiled_entries')
    .insert({
      date: entry.date,
      title: entry.title,
      slug: entry.slug,
      content: entry.content,
      published: entry.published
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating entry:', error);
    return null;
  }

  return data as UncompiledEntry;
};

// Update entry (admin only)
export const updateEntry = async (
  token: string,
  id: string,
  updates: Partial<Omit<UncompiledEntry, 'id' | 'created_at'>>
): Promise<UncompiledEntry | null> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('uncompiled_entries')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
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

// Delete entry (admin only)
export const deleteEntry = async (token: string, id: string): Promise<boolean> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('uncompiled_entries')
    .delete()
    .eq('id', id);

  return !error;
};

// Toggle publish status (admin only)
export const togglePublishEntry = async (token: string, id: string, published: boolean): Promise<boolean> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('uncompiled_entries')
    .update({ 
      published,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  return !error;
};

// ============ Side Quests Functions ============

// Get all side quests (public)
export const getSideQuests = async (): Promise<SideQuest[]> => {
  const { data, error } = await supabase.rpc('get_side_quests');

  if (error) {
    console.error('Error fetching side quests:', error);
    return [];
  }

  return data as SideQuest[];
};

// Get all side quests for admin (includes IDs)
export const getAllSideQuests = async (token: string): Promise<SideQuest[]> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('side_quests')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    console.error('Error fetching side quests:', error);
    return [];
  }

  return data as SideQuest[];
};

// Update side quest (admin only)
export const updateSideQuest = async (
  token: string,
  id: string,
  updates: Partial<Omit<SideQuest, 'id'>>
): Promise<SideQuest | null> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('side_quests')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating side quest:', error);
    return null;
  }

  // Record history if value or max_value changed
  if (updates.value !== undefined || updates.max_value !== undefined) {
    await supabase
      .from('side_quests_history')
      .insert({
        side_quest_id: id,
        value: data.value,
        max_value: data.max_value
      });
  }

  return data as SideQuest;
};

// Get side quest history
export const getSideQuestHistory = async (questId: string): Promise<SideQuestHistory[]> => {
  const { data, error } = await supabase.rpc('get_side_quest_history', {
    p_side_quest_id: questId
  });

  if (error) {
    console.error('Error fetching side quest history:', error);
    return [];
  }

  return data as SideQuestHistory[];
};

// Get all side quests with history (admin)
export const getSideQuestsWithHistory = async (token: string): Promise<SideQuestWithHistory[]> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase.rpc('get_side_quests_with_history');

  if (error) {
    console.error('Error fetching side quests with history:', error);
    return [];
  }

  return data as SideQuestWithHistory[];
};

// Helper: Create admin user (run this once manually or via script)
export const createAdminUser = async (email: string, password: string): Promise<boolean> => {
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const { error } = await supabase
      .from('admin_users')
      .insert({
        email,
        password_hash: passwordHash
      });

    return !error;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
};

// ============ Bootcamp Lectures Functions ============

// Get all published bootcamp lectures (public)
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

// Get all bootcamp lectures for admin (includes unpublished)
export const getAllBootcampLectures = async (token: string): Promise<BootcampLecture[]> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('bootcamp_lectures')
    .select('*')
    .order('day_number', { ascending: true });

  if (error) {
    console.error('Error fetching all bootcamp lectures:', error);
    return [];
  }

  return data as BootcampLecture[];
};

// Update bootcamp lecture (admin only)
export const updateBootcampLecture = async (
  token: string,
  id: string,
  updates: Partial<Omit<BootcampLecture, 'id' | 'created_at' | 'updated_at'>>
): Promise<BootcampLecture | null> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { data, error } = await supabase
    .from('bootcamp_lectures')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
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

// Toggle publish status for bootcamp lecture (admin only)
export const togglePublishBootcampLecture = async (
  token: string,
  id: string,
  isPublished: boolean
): Promise<boolean> => {
  const session = await verifyAdminSession(token);
  if (!session) {
    throw new Error('Unauthorized');
  }

  const { error } = await supabase
    .from('bootcamp_lectures')
    .update({
      is_published: isPublished,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  return !error;
};

