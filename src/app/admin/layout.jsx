"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const currentPath = window.location.pathname;

      if (!user) {
        if (currentPath !== '/admin/login') {
          router.push('/admin/login');
        } else {
          // If we are already on the login page and no user, stop loading
          setLoading(false);
        }
      } else {
        // If user exists, stop loading
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentPath = window.location.pathname;
      if (!session) {
        if (currentPath !== '/admin/login') {
          router.push('/admin/login');
        } else {
          // If we are already on the login page and no session, stop loading
          setLoading(false);
        }
      } else {
        // If session exists, stop loading
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
