// src/lib/auth.js
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function authenticateUser() {
  try {
    const supabase = createServerSupabaseClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return {
        error: NextResponse.json(
          { error: 'Unauthorized - Please login' },
          { status: 401 }
        ),
        user: null
      }
    }

    return { user, error: null }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      error: NextResponse.json(
        { error: 'Authentication failed' },
        { status: 401 }
      ),
      user: null
    }
  }
}