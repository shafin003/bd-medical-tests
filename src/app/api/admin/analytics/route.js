// src/app/api/admin/analytics/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { user, error } = await authenticateUser()
  if (error) return error

  try {
    const supabase = createServerSupabaseClient()

    const { data: popularSearches, error: fetchError } = await supabase
      .from('popular_searches')
      .select('query, search_count')
      .order('search_count', { ascending: false })
      .limit(10)

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch popular searches' },
        { status: 500 }
      )
    }

    return NextResponse.json({ popularSearches })
  } catch (error) {
    console.error('Error fetching analytics data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}