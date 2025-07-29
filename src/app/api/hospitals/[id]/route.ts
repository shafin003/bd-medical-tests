import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Hospital, MedicalTest, HospitalService } from '@/types/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<Hospital | { error: string }>> {
  const hospitalId = params.id;

  try {
    // Fetch hospital details
    const { data: hospital, error: hospitalError } = await supabase
      .from('hospitals')
      .select('*')
      .eq('id', hospitalId)
      .single();

    if (hospitalError) {
      if (hospitalError.code === 'PGRST116') { // No rows found
        return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
      }
      throw hospitalError;
    }

    if (!hospital) {
      return NextResponse.json({ error: 'Hospital not found' }, { status: 404 });
    }

    // Fetch services (tests) offered by this hospital
    const { data: services, error: servicesError } = await supabase
      .from('hospital_services')
      .select(`
        *,
        medical_tests (*)
      `)
      .eq('hospital_id', hospitalId);

    if (servicesError) throw servicesError;

    // Attach services to hospital object
    const hospitalWithServices = {
      ...hospital,
      services: services || [],
    };

    return NextResponse.json(hospitalWithServices as Hospital & { services: (HospitalService & { medical_tests: MedicalTest })[] });
  } catch (error) {
    console.error('Error fetching hospital details:', error);
    return NextResponse.json({ error: 'Failed to fetch hospital details' }, { status: 500 });
  }
}
