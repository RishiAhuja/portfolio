// app/api/track-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * API route to track session duration
 * Uses the new Next.js App Router API Routes format
 * This is particularly useful for tracking session duration when the page unloads
 * using the Navigator.sendBeacon API
 */
export async function POST(request: NextRequest) {
  try {
    // Parse form data (sendBeacon sends FormData)
    const formData = await request.formData();
    const sessionId = formData.get('session_id') as string;
    const duration = parseInt(formData.get('duration') as string, 10);
    
    // Validate input
    if (!sessionId || isNaN(duration) || duration < 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid input' },
        { status: 400 }
      );
    }
    
    // Insert session data
    const { error } = await supabase
      .from('sessions')
      .insert([{ 
        session_id: sessionId,
        duration_seconds: duration,
        path: request.headers.get('referer') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      }]);
      
    if (error) {
      console.error('Error tracking session:', error);
      return NextResponse.json(
        { success: false, message: 'Database error' },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error in track-session API route:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// Optional: Add a GET method to check if the API is working
export async function GET() {
  return NextResponse.json(
    { message: 'Session tracking API is active. Use POST to track sessions.' },
    { status: 200 }
  );
}