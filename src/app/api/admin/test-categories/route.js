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
    const { data: categories, error } = await supabase
      .from('test_categories')
      .select('*');

    if (error) {
      console.error("Error fetching test categories:", error);
      return response.json({ error: 'Failed to fetch test categories' }, { status: 500 });
    }

    return response.json(categories || []);
  } catch (error) {
    console.error('Unexpected error fetching test categories:', error);
    return response.json({ error: 'Failed to fetch test categories' }, { status: 500 });
  }
}

export async function POST(request) {
  const { authenticated, response: authResponse, supabase, response } = await isAdmin(request);
  if (!authenticated) return authResponse;

  try {
    const newCategory = await request.json();

    const { data, error } = await supabase
      .from('test_categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error("Error creating test category:", error);
      return response.json({ error: 'Failed to create test category' }, { status: 500 });
    }

    return response.json(data);
  } catch (error) {
    console.error('Unexpected error creating test category:', error);
    return response.json({ error: 'Failed to create test category' }, { status: 500 });
  }
}
