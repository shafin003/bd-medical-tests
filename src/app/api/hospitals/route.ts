import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Hospital } from '@/types/api';

export async function GET(): Promise<NextResponse<{ hospitals: Hospital[] | null } | { error: string }>> {
  try {
    const { data: hospitals, error } = await supabase
      .from('hospitals')
      .select('id, name'); // Only fetch ID and name for selection

    if (error) {
      console.error("Error fetching hospitals:", error);
      return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
    }

    return NextResponse.json({ hospitals });
  } catch (error) {
    console.error('Unexpected error fetching hospitals:', error);
    return NextResponse.json({ error: 'Failed to fetch hospitals' }, { status: 500 });
  }
}
