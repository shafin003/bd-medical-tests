import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MedicalTest } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin(request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function GET(request: NextRequest): Promise<NextResponse<MedicalTest[] | { error: string }>> {
  const auth = await isAdmin(request);
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

export async function POST(request: NextRequest): Promise<NextResponse<MedicalTest | { error: string }>> {
  const auth = await isAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const newMedicalTest: MedicalTest = await request.json();

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
