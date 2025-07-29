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
    const { data: categories, error } = await supabase
      .from('test_categories')
      .select('*');

    if (error) {
      console.error("Error fetching test categories:", error);
      return NextResponse.json({ error: 'Failed to fetch test categories' }, { status: 500 });
    }

    return NextResponse.json(categories || []);
  } catch (error) {
    console.error('Unexpected error fetching test categories:', error);
    return NextResponse.json({ error: 'Failed to fetch test categories' }, { status: 500 });
  }
}

export async function POST(request) {
  const auth = await isAdmin();
  if (!auth.authenticated) return auth.response;

  try {
    const newCategory = await request.json();

    const { data, error } = await supabase
      .from('test_categories')
      .insert([newCategory])
      .select()
      .single();

    if (error) {
      console.error("Error creating test category:", error);
      return NextResponse.json({ error: 'Failed to create test category' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error creating test category:', error);
    return NextResponse.json({ error: 'Failed to create test category' }, { status: 500 });
  }
}
