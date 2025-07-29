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

export async function GET(
  request,
  { params }
) {
  const { authenticated, response: authResponse, supabase, response } = await isAdmin(request);
  if (!authenticated) return authResponse;

  const testId = params.testId;

  try {
    const { data: services, error } = await supabase
      .from('hospital_services')
      .select(`
        *,
        hospitals (*),
        medical_tests (*)
      `)
      .eq('test_id', testId);

    if (error) {
      console.error(`Error fetching hospital services for test ${testId}:`, error);
      return response.json({ error: 'Failed to fetch hospital services' }, { status: 500 });
    }

    return response.json(services || []);
  } catch (error) {
    console.error('Unexpected error fetching hospital services:', error);
    return response.json({ error: 'Failed to fetch hospital services' }, { status: 500 });
  }
}