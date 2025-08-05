// src/app/api/admin/test-categories/[id]/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { error } = await authenticateUser()
  if (error) return error

  const { id } = params

  try {
    const updatedCategory = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: category, error: updateError } = await supabase
      .from('test_categories')
      .update(updatedCategory)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update test category ${id}` },
        { status: 500 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error(`Error updating test category ${id}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const { error } = await authenticateUser()
  if (error) return error

  const { id } = params

  try {
    const supabase = createServerSupabaseClient()

    const { error: deleteError } = await supabase
      .from('test_categories')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete test category ${id}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: `Test category ${id} deleted successfully` })
  } catch (error) {
    console.error(`Error deleting test category ${id}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}