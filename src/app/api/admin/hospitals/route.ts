import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Hospital } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  // In a real application, you would check user roles/metadata here
  // For now, any logged-in user is considered admin for simplicity
  return { authenticated: true, user };
}

export async function GET(): Promise<NextResponse<Hospital[] | { error: string }>> {
  const auth = await isAdmin();
  if (!auth.authenticated) return auth.response;

  try {
    const { data: hospitals, error } = await supabase
      .from('hospitals')
      .select('*');

    if (error) {
      console.error("Error fetching hospitals:", error);
      return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
    }

    return NextResponse.json(hospitals || []);
  } catch (error) {
    console.error('Unexpected error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<Hospital | { error: string }>> {
  const auth = await isAdmin();
  if (!auth.authenticated) return auth.response;

  try {
    const newHospital: Hospital = await request.json();

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
