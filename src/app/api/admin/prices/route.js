import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server.js';

// Helper function to check admin authentication
async function isAdmin(request) {
  const response = NextResponse.next();
  const supabase = await createServerSupabaseClient(request, response);
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user, supabase, response };
}

export async function PUT(request) {
  const { authenticated, response: authResponse, supabase, response } = await isAdmin(request);
  if (!authenticated) return authResponse;

  try {
    const updates = await request.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return response.json({ error: 'Invalid request body. Expected an array of updates.' }, { status: 400 });
    }

    const { error } = await supabase.from('hospital_services').upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error("Error performing bulk price update:", error);
      return response.json({ error: 'Failed to perform bulk price update' }, { status: 500 });
    }

    return response.json({ message: 'Bulk price update successful' });
  } catch (error) {
    console.error('Unexpected error during bulk price update:', error);
    return response.json({ error: 'Failed to perform bulk price update' }, { status: 500 });
  }
}
