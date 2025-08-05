// src/app/api/admin/prices/route.js
import { authenticateUser } from '@/lib/auth'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request) {
  const { error } = await authenticateUser()
  if (error) return error

  try {
    const updates = await request.json()
    const supabase = createServerSupabaseClient()

    const { error: updateError } = await supabase
      .from('hospital_services')
      .upsert(updates, { onConflict: 'id' })

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to perform bulk price update' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Bulk price update successful' })
  } catch (error) {
    console.error('Error during bulk price update:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}