// src/app/api/admin/tests/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { user, error } = await authenticateUser()
  if (error) return error

  try {
    const supabase = createServerSupabaseClient()
    const { data: medicalTests, error: fetchError } = await supabase
      .from('medical_tests')
      .select('*, test_categories(name)')

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch medical tests' },
        { status: 500 }
      )
    }

    return NextResponse.json(medicalTests)
  } catch (error) {
    console.error('Error fetching medical tests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  const { user, error } = await authenticateUser()
  if (error) return error

  try {
    const newMedicalTest = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: medicalTest, error: insertError } = await supabase
      .from('medical_tests')
      .insert([newMedicalTest])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create medical test' },
        { status: 500 }
      )
    }

    return NextResponse.json(medicalTest, { status: 201 })
  } catch (error) {
    console.error('Error creating medical test:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}