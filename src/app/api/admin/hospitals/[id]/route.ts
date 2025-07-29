import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Hospital } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin(_request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  // In a real application, you would check user roles/metadata here
  // For now, any logged-in user is considered admin for simplicity
  return { authenticated: true, user };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Hospital | { error: string }>> {
  const auth = await isAdmin(_request);
  if (!auth.authenticated) return auth.response;

  const hospitalId = params.id;

  try {
    const { data: hospital, error } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', hospitalId)
      .single();

    if (error) {
      console.error(`Error fetching hospital ${hospitalId}:`, error);
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch hospital' }, { status: 500 });
    }

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    return NextResponse.json(hospital);
  } catch (error) {
    console.error('Unexpected error fetching hospital:', error);
    return NextResponse.json({ error: 'Failed to fetch hospital' }, { status: 500 });
  }
}

export async function PUT(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Hospital | { error: string }>> {
  const auth = await isAdmin(_request);
  if (!auth.authenticated) return auth.response;

  const hospitalId = params.id;

  try {
    const updatedHospital: Hospital = await request.json();

    const { data, error } = await supabase
      .from('hospitals')
      .update(updatedHospital)
      .eq('id', hospitalId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating hospital ${hospitalId}:`, error);
      return NextResponse.json({ error: 'Failed to update hospital' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Hospital not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error updating hospital:', error);
    return NextResponse.json({ error: 'Failed to update hospital' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const auth = await isAdmin(_request);
  if (!auth.authenticated) return auth.response;

  const hospitalId = params.id;

  try {
    const { error } = await supabase
      .from('hospitals')
      .delete()
      .eq('id', hospitalId);

    if (error) {
      console.error(`Error deleting hospital ${hospitalId}:`, error);
      return NextResponse.json({ error: 'Failed to delete hospital' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting hospital:', error);
    return NextResponse.json({ error: 'Failed to delete hospital' }, { status: 500 });
  }
}
