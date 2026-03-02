import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { Database, UserRole } from '@/lib/types';

type ProfileData = {
  role: UserRole;
};

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const url = request.nextUrl.clone();
  const isAuthPage = url.pathname === '/login' || url.pathname === '/signup';
  const isDashboard = url.pathname.startsWith('/dashboard');
  const isTrain = url.pathname.startsWith('/train');

  // If user is logged in and trying to access auth pages, redirect to appropriate dashboard
  if (session && isAuthPage) {
    // Get user profile to determine role
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const profile = data as ProfileData | null;
    const redirectPath = profile?.role === 'trainer' ? '/dashboard' : '/train';
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  // If user is not logged in and trying to access protected pages, redirect to login
  if (!session && (isDashboard || isTrain)) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If user is logged in, check role-based access
  if (session && (isDashboard || isTrain)) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    const profile = data as ProfileData | null;

    // Trainers should access /dashboard, clients should access /train
    if (profile?.role === 'trainer' && isTrain) {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }

    if (profile?.role === 'client' && isDashboard) {
      url.pathname = '/train';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
