import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server.js';

// Helper function to check admin authentication
async function isAdmin(request, response) {
  const supabase = await createServerSupabaseClient(request, response);
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user, supabase };
}

export async function GET(request) {
  const response = NextResponse.next();
  const { authenticated, response: authResponse, supabase } = await isAdmin(request, response);
  if (!authenticated) return authResponse;

  try {
    const { data: hospitals, error } = await supabase
      .from('hospitals')
      .select('*');

    if (error) {
      console.error("Error fetching hospitals:", error);
      return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
    }

    console.log("Fetched hospitals:", hospitals);
    return NextResponse.json(hospitals || []);
  } catch (error) {
    console.error('Unexpected error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request) {
  const response = NextResponse.next();
  const { authenticated, response: authResponse, supabase } = await isAdmin(request, response);
  if (!authenticated) return authResponse;

  try {
    const newHospital = await request.json();

    const { data, error } = await supabase
      .from('hospitals')
      .insert([newHospital])
      .select()
      .single();

    if (error) {
      console.error("Error creating hospital:", error);
      return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error creating hospital:', error);
    return NextResponse.json({ error: 'Failed to create hospital' }, { status: 500 });
  }
}