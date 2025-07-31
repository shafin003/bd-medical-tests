import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(_request, { params }) {
	const testId = params.id;

	try {
		// Fetch medical test details
		const { data: medicalTest, error: medicalTestError } = await supabase
			.from('medical_tests')
			.select('*, test_categories(*)') // Select test and its category
			.eq('id', testId)
			.single();

		if (medicalTestError) {
			if (medicalTestError.code === 'PGRST116') {
				// No rows found
				return NextResponse.json({ error: 'Medical test not found' }, { status: 404 });
			}
			throw medicalTestError;
		}

		if (!medicalTest) {
			return NextResponse.json({ error: 'Medical test not found' }, { status: 404 });
		}

		// Fetch hospital services for this test
		const { data: hospitalServices, error: hospitalServicesError } = await supabase
			.from('hospital_services')
			.select(
				`
        *,
        hospitals (*)
      `
			)
			.eq('test_id', testId)
			.order('price', { ascending: true }); // Order by price for comparison

		if (hospitalServicesError) throw hospitalServicesError;

		// Attach services to medical test object
		const medicalTestWithServices = {
			...medicalTest,
			hospital_services: hospitalServices || [],
		};

		return NextResponse.json(medicalTestWithServices);
	} catch (error) {
		console.error('Error fetching medical test details:', error);
		return NextResponse.json({ error: 'Failed to fetch medical test details' }, { status: 500 });
	}
}
