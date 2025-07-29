import { NextRequest, NextResponse } from 'next/server';
import { SearchRequest, SearchResponse, Hospital, MedicalTest, TestCategory } from '@/types/api';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const searchData: SearchRequest = await request.json();
  const { query, filters, sort, page = 1, limit = 10 } = searchData;

  try {
    // --- Hospital Search and Filtering ---
    let hospitalQuery = supabase.from('hospitals').select('*');

    // Apply text search if query exists
    if (query) {
      const { data: rpcHospitals, error: rpcHospitalError } = await supabase.rpc('search_hospitals', { search_query: query });
      if (rpcHospitalError) throw rpcHospitalError;
      const rpcHospitalIds = rpcHospitals.map((h: any) => h.id);
      if (rpcHospitalIds.length > 0) {
        hospitalQuery = hospitalQuery.in('id', rpcHospitalIds);
      } else {
        hospitalQuery = hospitalQuery.eq('id', '00000000-0000-0000-0000-000000000000'); // Return no results if RPC finds none
      }
    }

    // Apply filters
    if (filters.city) hospitalQuery = hospitalQuery.ilike('city', `%${filters.city}%`);
    if (filters.division) hospitalQuery = hospitalQuery.ilike('division', `%${filters.division}%`);
    if (filters.area) hospitalQuery = hospitalQuery.ilike('area', `%${filters.area}%`);
    if (filters.rating) hospitalQuery = hospitalQuery.gte('rating', filters.rating);
    if (filters.homeCollection !== undefined) hospitalQuery = hospitalQuery.eq('home_collection', filters.homeCollection);
    if (filters.facilities && filters.facilities.length > 0) {
      hospitalQuery = hospitalQuery.contains('facilities', filters.facilities);
    }
    if (filters.insurance && filters.insurance.length > 0) {
      hospitalQuery = hospitalQuery.contains('insurance_accepted', filters.insurance);
    }

    const { data: filteredHospitals, error: filteredHospitalError } = await hospitalQuery;
    if (filteredHospitalError) throw filteredHospitalError;
    const hospitalsResults = filteredHospitals || [];

    // --- Test Search and Filtering ---
    let testQuery = supabase.from('medical_tests').select('*');

    if (query) {
      const { data: rpcTests, error: rpcTestError } = await supabase.rpc('search_tests', { search_query: query });
      if (rpcTestError) throw rpcTestError;
      const rpcTestIds = rpcTests.map((t: any) => t.id);
      if (rpcTestIds.length > 0) {
        testQuery = testQuery.in('id', rpcTestIds);
      } else {
        testQuery = testQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      }
    }

    if (filters.testCategory) {
      const { data: categoryData, error: categoryError } = await supabase
        .from('test_categories')
        .select('id')
        .ilike('name', `%${filters.testCategory}%`)
        .single();
      if (categoryError) console.error("Error fetching category for filter:", categoryError);
      if (categoryData) {
        testQuery = testQuery.eq('category_id', categoryData.id);
      } else {
        testQuery = testQuery.eq('id', '00000000-0000-0000-0000-000000000000');
      }
    }

    const { data: filteredTests, error: filteredTestError } = await testQuery;
    if (filteredTestError) throw filteredTestError;
    const testsResults = filteredTests || [];

    // --- Process Tests with Prices and Categories ---
    const processedTests = await Promise.all(testsResults.map(async (t) => {
      let testPricesQuery = supabase
        .from('hospital_services')
        .select('price')
        .eq('test_id', t.id)
        .eq('available', true);

      if (filters.minPrice) testPricesQuery = testPricesQuery.gte('price', filters.minPrice);
      if (filters.maxPrice) testPricesQuery = testPricesQuery.lte('price', filters.maxPrice);

      const { data: pricesData, error: pricesError } = await testPricesQuery;

      if (pricesError) console.error("Error fetching prices for test", t.id, pricesError);

      const prices = pricesData ? pricesData.map(p => p.price) : [];
      const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
      const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;
      const availableHospitals = prices.length;

      let category: TestCategory = { id: '', name: t.category_name || '', description: '', sort_order: 0 };
      if (t.category_id) {
        const { data: categoryData, error: categoryError } = await supabase
          .from('test_categories')
          .select('*')
          .eq('id', t.category_id)
          .single();
        if (categoryError) console.error("Error fetching category for test", t.id, categoryError);
        if (categoryData) category = categoryData;
      }

      return {
        ...t,
        category,
        lowestPrice,
        highestPrice,
        availableHospitals,
        type: 'test',
      };
    }));

    // Filter out tests that don't match price range after fetching prices
    const finalFilteredTests = processedTests.filter(t => {
      if (filters.minPrice && t.lowestPrice < filters.minPrice) return false;
      if (filters.maxPrice && t.highestPrice > filters.maxPrice) return false;
      return true;
    });

    // --- Combine and Sort Results ---
    let combinedResults: (Hospital | MedicalTest)[] = [];
    combinedResults = combinedResults.concat(hospitalsResults.map(h => ({ ...h, type: 'hospital' })));
    combinedResults = combinedResults.concat(finalFilteredTests);

    // Apply sorting
    switch (sort) {
      case 'price_asc':
        combinedResults.sort((a, b) => {
          if (a.type === 'test' && b.type === 'test') return a.lowestPrice - b.lowestPrice;
          return 0;
        });
        break;
      case 'price_desc':
        combinedResults.sort((a, b) => {
          if (a.type === 'test' && b.type === 'test') return b.lowestPrice - a.lowestPrice;
          return 0;
        });
        break;
      case 'rating_desc':
        combinedResults.sort((a, b) => {
          if (a.type === 'hospital' && b.type === 'hospital') return b.rating - a.rating;
          return 0;
        });
        break;
      case 'relevance':
      default:
        combinedResults.sort((a, b) => {
          const rankA = (a as any).rank || 0;
          const rankB = (b as any).rank || 0;
          return rankB - rankA;
        });
        break;
    }

    const totalResultsCount = combinedResults.length;

    // Apply final pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedCombinedResults = combinedResults.slice(startIndex, endIndex);

    const finalHospitals = paginatedCombinedResults.filter(item => item.type === 'hospital') as (Hospital & { relevanceScore: number })[];
    const finalTests = paginatedCombinedResults.filter(item => item.type === 'test') as (MedicalTest & { category: TestCategory; lowestPrice: number; highestPrice: number; availableHospitals: number })[];

    const response: SearchResponse = {
      hospitals: finalHospitals.map(h => ({ ...h, matchingTests: [], relevanceScore: h.rank || 0 })),
      tests: finalTests,
      totalResults: totalResultsCount,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(totalResultsCount / limit),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to perform search' } as any, { status: 500 });
  }
}
