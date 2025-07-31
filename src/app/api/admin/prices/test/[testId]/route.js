// src/app/api/admin/prices/test/[testId]/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  const { user, error } = await authenticateUser()
  if (error) return error

  const { testId } = params

  try {
    const supabase = createServerSupabaseClient()

    const { data: prices, error: fetchError } = await supabase
      .from('hospital_services')
      .select('*, hospitals(name)')
      .eq('test_id', testId)

    if (fetchError) {
      return NextResponse.json(
        { error: `Failed to fetch prices for test ${testId}` },
        { status: 500 }
      )
    }

    return NextResponse.json(prices)
  } catch (error) {
    console.error(`Error fetching prices for test ${testId}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}