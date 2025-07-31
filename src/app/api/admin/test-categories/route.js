// src/app/api/admin/test-categories/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const { user, error } = await authenticateUser()
  if (error) return error

  try {
    const supabase = createServerSupabaseClient()
    const { data: categories, error: fetchError } = await supabase
      .from('test_categories')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      return NextResponse.json(
        { error: 'Failed to fetch test categories' },
        { status: 500 }
      )
    }

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching test categories:', error)
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
    const newCategory = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: category, error: insertError } = await supabase
      .from('test_categories')
      .insert([newCategory])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json(
        { error: 'Failed to create test category' },
        { status: 500 }
      )
    }

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error('Error creating test category:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}