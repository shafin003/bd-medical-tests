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

export async function GET(request) {
  const { authenticated, response: authResponse, supabase, response } = await isAdmin(request);
  if (!authenticated) return authResponse;

  try {
    // Fetch popular searches
    const { data: popularSearches, error: popularSearchesError } = await supabase
      .from('popular_searches')
      .select('query, search_count')
      .order('search_count', { ascending: false })
      .limit(10);

    if (popularSearchesError) {
      console.error("Error fetching popular searches:", popularSearchesError.message || popularSearchesError);
      return response.json({ error: 'Failed to fetch popular searches' }, { status: 500 });
    }

    return response.json({ popularSearches: popularSearches || [] });
  } catch (error) {
    console.error('Unexpected error fetching analytics data:', error);
    return response.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}