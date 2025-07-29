import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Helper function to check admin authentication
async function isAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function GET() {
  const auth = await isAdmin();
  if (!auth.authenticated) return auth.response;

  try {
    const { data: medicalTests, error } = await supabase
      .from('medical_tests')
      .select('*, test_categories(name)'); // Fetch category name along with test

    if (error) {
      console.error("Error fetching medical tests:", error);
      return NextResponse.json({ error: 'Failed to fetch medical tests' }, { status: 500 });
    }

    return NextResponse.json(medicalTests || []);
  } catch (error) {
    console.error('Unexpected error fetching medical tests:', error);
    return NextResponse.json({ error: 'Failed to fetch medical tests' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await isAdmin();
  if (!auth.authenticated) return auth.response;

  try {
    const newMedicalTest = await request.json();

    const { data, error } = await supabase
      .from('medical_tests')
      .insert([newMedicalTest])
      .select()
      .single();

    if (error) {
      console.error("Error creating medical test:", error);
      return NextResponse.json({ error: 'Failed to create medical test' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error creating medical test:', error);
    return NextResponse.json({ error: 'Failed to create medical test' }, { status: 500 });
  }
}
