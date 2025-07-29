import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { HospitalService, Hospital, MedicalTest } from '@/types/api';

// Helper function to check admin authentication
async function isAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { authenticated: false, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { authenticated: true, user };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { testId: string } }
): Promise<NextResponse<(HospitalService & { hospitals: Hospital, medical_tests: MedicalTest })[] | { error: string }>> {
  const auth = await isAdmin();
  if (!auth.authenticated) return auth.response;

  const testId = params.testId;

  try {
    const { data: services, error } = await supabase
      .from('hospital_services')
      .select(`
        *,
        hospitals (*),
        medical_tests (*)
      `)
      .eq('test_id', testId);

    if (error) {
      console.error(`Error fetching hospital services for test ${testId}:`, error);
      return NextResponse.json({ error: 'Failed to fetch hospital services' }, { status: 500 });
    }

    return NextResponse.json(services || []);
  } catch (error) {
    console.error('Unexpected error fetching hospital services:', error);
    return NextResponse.json({ error: 'Failed to fetch hospital services' }, { status: 500 });
  }
}
