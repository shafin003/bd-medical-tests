"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/admin/login');
      } else {
        setUser(user);
        setLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/admin/login');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  }, [router, supabase]);

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-14rem)] py-12">
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hospital Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage hospitals: add, edit, remove, verify.</p>
            <Button className="mt-4">Go to Hospitals</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test & Price Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Manage medical tests, categories, and prices.</p>
            <Button className="mt-4">Go to Tests</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View popular searches, user behavior, and performance metrics.</p>
            <Button className="mt-4">View Analytics</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
