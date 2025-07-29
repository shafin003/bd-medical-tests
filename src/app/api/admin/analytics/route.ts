import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to check admin authentication
async function isAdmin(request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function GET(request: NextRequest): Promise<NextResponse<{ popularSearches: any[] } | { error: string }>> {
  const auth = await isAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    // Fetch popular searches
    const { data: popularSearches, error: popularSearchesError } = await supabase
      .from('popular_searches')
      .select('query, search_count')
      .order('search_count', { ascending: false })
      .limit(10);

    if (popularSearchesError) {
      console.error("Error fetching popular searches:", popularSearchesError);
      return NextResponse.json({ error: 'Failed to fetch popular searches' }, { status: 500 });
    }

    return NextResponse.json({ popularSearches: popularSearches || [] });
  } catch (error) {
    console.error('Unexpected error fetching analytics data:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
