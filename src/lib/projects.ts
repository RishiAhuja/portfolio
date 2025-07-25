// lib/projects.ts
import { supabase, noCacheSupabase } from './supabase';

// Project interface
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  full_description?: string;
  tech_stack: string[];
  features: string[];
  github_url?: string;
  live_url?: string;
  image_url?: string;
  category: string;
  created_at: string;
  is_featured?: boolean;
  view_count?: number;
}

/**
 * Fetch all projects from Supabase
 * @param limit Optional limit on number of projects
 * @param category Optional category filter
 * @returns Array of projects
 */
export const getAllProjects = async (
  limit?: number,
  category?: string
): Promise<Project[]> => {
  try {
    let query = supabase
      .from('projects')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

/**
 * Fetch a single project by slug
 * @param slug Project slug
 * @returns Project object or null
 */
export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  try {
    // Use regular supabase client which has environment variables properly set
    const timestamp = Date.now(); // Add timestamp for logging
    
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }


    return data;
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    return null;
  }
};

/**
 * Increment the view count for a project
 * This should ONLY be called from client components!
 * @param projectId Project ID
 */
export const incrementProjectView = async (projectId: string): Promise<void> => {
  try {
    // Only run this in the browser
    if (typeof window === 'undefined') return;
    
    // Check if this project has been viewed in this session
    const viewedProjects = JSON.parse(
      sessionStorage.getItem('viewed_projects') || '[]'
    );
    
    if (viewedProjects.includes(projectId)) {
      return; // Already viewed in this session
    }
    
   
    // Add to viewed projects
    viewedProjects.push(projectId);
    sessionStorage.setItem('viewed_projects', JSON.stringify(viewedProjects));
    
    // Increment the view count
    const { error, data } = await supabase.rpc('increment_project_view', { p_project_id: projectId });
    
    if (error) {
      console.error('RPC error:', error);
      
      // Fallback: Directly update the view count if RPC fails
      const result = await supabase
        .from('projects')
        .update({ view_count: supabase.rpc('increment', { value: 'view_count' }) })
        .eq('id', projectId);
        
    }
  } catch (error) {
    console.error('Error incrementing project view:', error);
  }
};

/**
 * Get related projects
 * @param currentProjectId Current project ID to exclude
 * @param category Category to match
 * @param limit Maximum number of projects to return
 * @returns Array of related projects
 */
export const getRelatedProjects = async (
  currentProjectId: string,
  category: string,
  limit: number = 3
): Promise<Project[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category', category)
      .neq('id', currentProjectId)
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching related projects:', error);
    return [];
  }
};

// Debug function to log all projects and their slugs
export const debugListAllProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('id, title, slug')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching projects for debug:', error);
      return;
    }
     
    return data;
  } catch (error) {
    console.error('Error in debug function:', error);
  }
};