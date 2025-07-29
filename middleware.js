import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from './src/lib/supabase/server.js';

export async function middleware(request) {
  const response = NextResponse.next();
  const { supabase } = await createServerSupabaseClient(request, response);

  const { data: { user }, error: userError } = await supabase.auth.getUser();

  console.log('Middleware: User:', user);
  console.log('Middleware: User Error:', userError);
  console.log('Middleware: Response Headers:', response.headers);

  if (
    !user &&
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.startsWith('/admin/login')
  ) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/admin/login';
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};

