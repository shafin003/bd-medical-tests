import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { HospitalService } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin(request: NextRequest) {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function PUT(request: NextRequest): Promise<NextResponse<{ message: string } | { error: string }>> {
  const auth = await isAdmin(request);
  if (!auth.authenticated) return auth.response;

  try {
    const updates: { id: string; price?: number; discounted_price?: number; discount_percentage?: number; available?: boolean; home_collection_available?: boolean; home_collection_fee?: number; report_delivery_time?: string; online_report?: boolean; emergency_available?: boolean; notes?: string; }[] = await request.json();

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json({ error: 'Invalid request body. Expected an array of updates.' }, { status: 400 });
    }

    const { error } = await supabase.from('hospital_services').upsert(updates, { onConflict: 'id' });

    if (error) {
      console.error("Error performing bulk price update:", error);
      return NextResponse.json({ error: 'Failed to perform bulk price update' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Bulk price update successful' });
  } catch (error) {
    console.error('Unexpected error during bulk price update:', error);
    return NextResponse.json({ error: 'Failed to perform bulk price update' }, { status: 500 });
  }
}
