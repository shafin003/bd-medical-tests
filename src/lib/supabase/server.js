import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function createServerSupabaseClient(req, res) {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: async (name) => (await cookieStore.get(name))?.value,
        set: (name, value, options) => {
          console.log(`Supabase Server: Setting cookie: ${name}=${value}`);
          res.cookies.set(name, value, options);
        },
        remove: (name, options) => {
          console.log(`Supabase Server: Removing cookie: ${name}`);
          res.cookies.delete(name, options);
        },
      },
    }
  );
  return supabase;
}