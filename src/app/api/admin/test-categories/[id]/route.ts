import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { TestCategory } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin(request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<TestCategory | { error: string }>> {
  const auth = await isAdmin(request);
  if (!auth.authenticated) return auth.response;

  const categoryId = params.id;

  try {
    const { data: category, error } = await supabase
      .from('test_categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error(`Error fetching test category ${categoryId}:`, error);
      if (error.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Test category not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to fetch test category' }, { status: 500 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Test category not found' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Unexpected error fetching test category:', error);
    return NextResponse.json({ error: 'Failed to fetch test category' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<TestCategory | { error: string }>> {
  const auth = await isAdmin(request);
  if (!auth.authenticated) return auth.response;

  const categoryId = params.id;

  try {
    const updatedCategory: TestCategory = await request.json();

    const { data, error } = await supabase
      .from('test_categories')
      .update(updatedCategory)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating test category ${categoryId}:`, error);
      return NextResponse.json({ error: 'Failed to update test category' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Test category not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error updating test category:', error);
    return NextResponse.json({ error: 'Failed to update test category' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<{ message: string } | { error: string }>> {
  const auth = await isAdmin(request);
  if (!auth.authenticated) return auth.response;

  const categoryId = params.id;

  try {
    const { error } = await supabase
      .from('test_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error(`Error deleting test category ${categoryId}:`, error);
      return NextResponse.json({ error: 'Failed to delete test category' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Test category deleted successfully' });
  } catch (error) {
    console.error('Unexpected error deleting test category:', error);
    return NextResponse.json({ error: 'Failed to delete test category' }, { status: 500 });
  }
}
