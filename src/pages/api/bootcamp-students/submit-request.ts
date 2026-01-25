import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  console.log('=== API Route Called ===');
  
  try {
    const textBody = await request.text();
    
    console.log('Received request body (raw text):', textBody);
    console.log('Request method:', request.method);
    
    if (!textBody || textBody.trim() === '') {
      console.error('Empty request body received');
      return new Response(
        JSON.stringify({ error: 'Request body is empty' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    let body;
    try {
      body = JSON.parse(textBody);
      console.log('Parsed body:', body);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { name, email, college, yearOfStudy, linkedinProfile, linkedinPost, githubProfile, initials, learningTakeaway, consent } = body;

    // Validate required fields
    if (!name || !email || !college || !linkedinProfile || !initials) {
      return new Response(
        JSON.stringify({ error: 'Name, email, college, LinkedIn profile, and initials are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate LinkedIn profile URL
    if (!linkedinProfile.includes('linkedin.com')) {
      return new Response(
        JSON.stringify({ error: 'Invalid LinkedIn profile URL' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Insert the student request with pending status
    const { data, error } = await supabase
      .from('bootcamp_students')
      .insert([
        {
          name,
          email,
          college,
          year_of_study: yearOfStudy || null,
          linkedin_profile: linkedinProfile,
          linkedin_post: linkedinPost || null,
          github_profile: githubProfile || null,
          initials,
          learning_takeaway: learningTakeaway || null,
          consent: consent ?? true,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error inserting student request:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit request' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Request submitted successfully! You will be listed once approved.',
        data 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in submit-request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
