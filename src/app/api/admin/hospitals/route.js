// src/app/api/admin/hospitals/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  // Authenticate user
  const { user, error } = await authenticateUser()
  if (error) return error

  try {
    const supabase = createServerSupabaseClient()

    const { data: hospitals, error: fetchError } = await supabase
      .from('hospitals')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch hospitals' },
        { status: 500 }
      )
    }

    return NextResponse.json(hospitals)
  } catch (error) {
    console.error('Error fetching hospitals:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  // Authenticate user
  const { user, error } = await authenticateUser()
  if (error) return error

  try {
    const hospitalData = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: hospital, error: insertError } = await supabase
      .from('hospitals')
      .insert([hospitalData])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create hospital' },
        { status: 500 }
      )
    }

    return NextResponse.json(hospital, { status: 201 })
  } catch (error) {
    console.error('Error creating hospital:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}