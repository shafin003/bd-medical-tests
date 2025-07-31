// src/app/admin/layout.jsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Toaster } from '@/components/ui/toaster'

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Create browser client for client-side operations
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Auth error:', error)
          if (pathname !== '/admin/login') {
            router.push('/admin/login')
          }
          return
        }

        setUser(user)

        // If no user and not on login page, redirect to login
        if (!user && pathname !== '/admin/login') {
          router.push('/admin/login')
        }

        // If user exists and on login page, redirect to dashboard
        if (user && pathname === '/admin/login') {
          router.push('/admin/dashboard')
        }
      } catch (error) {
        console.error('Error checking auth:', error)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user)
          if (pathname === '/admin/login') {
            router.push('/admin/dashboard')
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          router.push('/admin/login')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [router, pathname, supabase.auth])

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading admin panel...</div>
      </div>
    )
  }

  // Always render login page
  if (pathname === '/admin/login') {
    return (
      <>
        {children}
        <Toaster />
      </>
    )
  }

  // Only render admin content if user is authenticated
  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}