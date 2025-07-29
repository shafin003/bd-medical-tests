import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query || query.trim() === '') {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const searchQuery = `%${query.toLowerCase()}%`;

    // Search for hospital names
    const { data: hospitalNames, error: hospitalError } = await supabase
      .from('hospitals')
      .select('name')
      .ilike('name', searchQuery)
      .limit(5);

    if (hospitalError) throw hospitalError;

    // Search for test names
    const { data: testNames, error: testError } = await supabase
      .from('medical_tests')
      .select('name')
      .ilike('name', searchQuery)
      .limit(5);

    if (testError) throw testError;

    // Search for locations (city, area, division)
    const { data: locations, error: locationError } = await supabase
      .from('hospitals')
      .select('city, area, division')
      .or(`city.ilike.${searchQuery},area.ilike.${searchQuery},division.ilike.${searchQuery}`)
      .limit(5);

    if (locationError) throw locationError;

    const suggestions = new Set();

    hospitalNames?.forEach(h => suggestions.add(h.name));
    testNames?.forEach(t => suggestions.add(t.name));
    locations?.forEach(loc => {
      if (loc.city && loc.city.toLowerCase().includes(query.toLowerCase())) suggestions.add(loc.city);
      if (loc.area && loc.area.toLowerCase().includes(query.toLowerCase())) suggestions.add(loc.area);
      if (loc.division && loc.division.toLowerCase().includes(query.toLowerCase())) suggestions.add(loc.division);
    });

    return NextResponse.json(Array.from(suggestions).slice(0, 10), { status: 200 }); // Limit to top 10 unique suggestions
  } catch (error) {
    console.error('Autocomplete API error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
