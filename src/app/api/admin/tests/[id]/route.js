// src/app/api/admin/tests/[id]/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request, { params }) {
  const { error } = await authenticateUser()
  if (error) return error

  const { id } = params

  try {
    const updatedMedicalTest = await request.json()
    const supabase = createServerSupabaseClient()

    const { data: medicalTest, error: updateError } = await supabase
      .from('medical_tests')
      .update(updatedMedicalTest)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { error: `Failed to update medical test ${id}` },
        { status: 500 }
      )
    }

    return NextResponse.json(medicalTest)
  } catch (error) {
    console.error(`Error updating medical test ${id}:`, error)
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
      .from('medical_tests')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json(
        { error: `Failed to delete medical test ${id}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: `Medical test ${id} deleted successfully` })
  } catch (error) {
    console.error(`Error deleting medical test ${id}:`, error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}