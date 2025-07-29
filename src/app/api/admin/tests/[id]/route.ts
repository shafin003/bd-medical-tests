import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MedicalTest } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin(_request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<MedicalTest | { error: string }>> {
  const auth = await isAdmin(_request);
  if (!auth.authenticated) return auth.response;

  const testId = params.id;

  try {
    const { data: medicalTest, error } = await supabase
      .from('medical_tests')
      .select('*, test_categories(name)')
      .eq('id', testId)
      .single();

    if (error) {
      console.error(`Error fetching medical test ${testId}:`, error);
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Medical test not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch medical test' }, { status: 500 });
    }

    if (!medicalTest) {
      return NextResponse.json({ error: 'Medical test not found' }, { status: 404 });
    }

    return NextResponse.json(medicalTest);
  } catch (error) {
    console.error('Unexpected error fetching medical test:', error);
    return NextResponse.json({ error: 'Failed to fetch medical test' }, { status: 500 });
  }
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<MedicalTest | { error: string }>> {
  const auth = await isAdmin(_request);
  if (!auth.authenticated) return auth.response;

  const testId = params.id;

  try {
    const updatedMedicalTest: MedicalTest = await request.json();

    const { data, error } = await supabase
      .from('medical_tests')
      .update(updatedMedicalTest)
      .eq('id', testId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating medical test ${testId}:`, error);
      return NextResponse.json({ error: 'Failed to update medical test' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Medical test not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error updating medical test:', error);
    return NextResponse.json({ error: 'Failed to update medical test' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const auth = await isAdmin(_request);
  if (!auth.authenticated) return auth.response;

  const testId = params.id;

  try {
    const { error } = await supabase
      .from('medical_tests')
      .delete()
      .eq('id', testId);

    if (error) {
      console.error(`Error deleting medical test ${testId}:`, error);
      return NextResponse.json({ error: 'Failed to delete medical test' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Medical test deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting medical test:', error);
    return NextResponse.json({ error: 'Failed to delete medical test' }, { status: 500 });
  }
}
