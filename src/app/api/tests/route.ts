import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { MedicalTest } from '@/types/api';

export async function GET(request: NextRequest): Promise<NextResponse<{ tests: MedicalTest[] | null } | { error: string }>> {
  try {
    const { data: tests, error } = await supabase
      .from('medical_tests')
      .select('id, name'); // Only fetch ID and name for selection

    if (error) {
      console.error("Error fetching medical tests:", error);
      return NextResponse.json({ error: 'Failed to fetch medical tests' }, { status: 500 });
    }

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Unexpected error fetching medical tests:', error);
    return NextResponse.json({ error: 'Failed to fetch medical tests' }, { status: 500 });
  }
}
