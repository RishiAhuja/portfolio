// API route for incrementing project views
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Disable all caching for this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const { projectId } = await request.json();
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`API: Incrementing view for project ${projectId}`);

    // Increment the view count
    const { error, data } = await supabase.rpc('increment_project_view', { 
      p_project_id: projectId 
    });
    
    if (error) {
      console.error('Failed to increment view count:', error);
      
      // Fallback
      const result = await supabase
        .from('projects')
        .update({ view_count: supabase.rpc('increment', { value: 'view_count' }) })
        .eq('id', projectId);
        
      if (result.error) {
        return NextResponse.json(
          { error: 'Failed to increment view count' },
          { status: 500 }
        );
      }
    }
    
    // Fetch the updated view count
    const { data: updatedProject, error: fetchError } = await supabase
      .from('projects')
      .select('view_count')
      .eq('id', projectId)
      .single();
      
    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch updated view count' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      view_count: updatedProject?.view_count
    });
  } catch (error) {
    console.error('Error processing view increment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
