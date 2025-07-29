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
    const { data: medicalTests, error } = await supabase
      .from('medical_tests')
      .select('*, test_categories(name)'); // Fetch category name along with test

    if (error) {
      console.error("Error fetching medical tests:", error);
      return response.json({ error: 'Failed to fetch medical tests' }, { status: 500 });
    }

    return response.json(medicalTests || []);
  } catch (error) {
    console.error('Unexpected error fetching medical tests:', error);
    return response.json({ error: 'Failed to fetch medical tests' }, { status: 500 });
  }
}

export async function POST(request) {
  const { authenticated, response: authResponse, supabase, response } = await isAdmin(request);
  if (!authenticated) return authResponse;

  try {
    const newMedicalTest = await request.json();

    const { data, error } = await supabase
      .from('medical_tests')
      .insert([newMedicalTest])
      .select()
      .single();

    if (error) {
      console.error("Error creating medical test:", error);
      return response.json({ error: 'Failed to create medical test' }, { status: 500 });
    }

    return response.json(data);
  } catch (error) {
    console.error('Unexpected error creating medical test:', error);
    return response.json({ error: 'Failed to create medical test' }, { status: 500 });
  }
}
