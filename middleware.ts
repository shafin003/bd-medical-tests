import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from './src/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createServerSupabaseClient(request);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
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
