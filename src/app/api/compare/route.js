import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(request) {
  const { hospitalIds, testId } = await request.json();

  if (!hospitalIds || hospitalIds.length === 0) {
    return NextResponse.json({ error: 'No hospital IDs provided for comparison' }, { status: 400 });
  }

  try {
    const hospitalsData = [];

    for (const hospitalId of hospitalIds) {
      // Fetch hospital details
      const { data: hospital, error: hospitalError } = await supabase
        .from('hospitals')
        .select('*')
        .eq('id', hospitalId)
        .single();

      if (hospitalError) {
        console.error(`Error fetching hospital ${hospitalId}:`, hospitalError);
        continue; // Skip this hospital if there's an error
      }

      if (!hospital) {
        console.warn(`Hospital ${hospitalId} not found.`);
        continue; // Skip if hospital not found
      }

      // Fetch services (tests) for this hospital, optionally filtered by testId
      let servicesQuery = supabase
        .from('hospital_services')
        .select(`
          *,
          medical_tests (*)
        `)
        .eq('hospital_id', hospitalId);

      if (testId) {
        servicesQuery = servicesQuery.eq('test_id', testId);
      }

      const { data: services, error: servicesError } = await servicesQuery;

      if (servicesError) {
        console.error(`Error fetching services for hospital ${hospitalId}:`, servicesError);
        continue; // Skip services for this hospital if error
      }

      hospitalsData.push({
        ...hospital,
        services: services || [],
      });
    }

    let testComparison = undefined;

    if (testId) {
      const { data: test, error: testError } = await supabase
        .from('medical_tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) {
        console.error(`Error fetching test ${testId}:`, testError);
      } else if (test) {
        const prices = hospitalsData.map(hosp => {
          const service = hosp.services.find(s => s.test_id === testId);
          return {
            hospitalId: hosp.id,
            hospitalName: hosp.name,
            price: service?.price || 0,
            discountedPrice: service?.discounted_price,
            homeCollectionFee: service?.home_collection_fee || 0,
            deliveryTime: service?.report_delivery_time,
          };
        });
        testComparison = {
          test: test,
          prices,
        };
      }
    }

    const response = {
      hospitals: hospitalsData,
      testComparison,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error during comparison API call:', error);
    return NextResponse.json({ error: 'Failed to perform comparison' }, { status: 500 });
  }
}
