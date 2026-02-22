import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'hi'];
const DEFAULT_LOCALE = 'en';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle locale detection and routing
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  let locale = DEFAULT_LOCALE;
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // If no locale in pathname, redirect to localized URL (but never for API routes)
  if (!pathnameHasLocale && pathname !== '/' && !pathname.startsWith('/api/')) {
    const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const acceptLanguage = request.headers.get('accept-language');

    if (localeCookie && SUPPORTED_LOCALES.includes(localeCookie)) {
      locale = localeCookie;
    } else if (acceptLanguage) {
      const preferredLocale = acceptLanguage.split(',')[0].split('-')[0];
      if (SUPPORTED_LOCALES.includes(preferredLocale)) {
        locale = preferredLocale;
      }
    }

    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${pathname}`;
    response = NextResponse.redirect(url);
  } else if (pathnameHasLocale) {
    // Extract locale from pathname
    const localeMatch = pathname.match(/^\/([a-z]{2})/);
    if (localeMatch) {
      locale = localeMatch[1];
    }
  }

  // Set locale in response headers for use in server components
  response.headers.set('x-locale', locale);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key',
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: "",
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const authRoutes = ["/login", "/signup"];
  const isAuthRoute = authRoutes.some((route) =>
    request.nextUrl.pathname.includes(route)
  );

  if (isAuthRoute && user) {
    return NextResponse.redirect(new URL(`/${locale}/learn`, request.url));
  }

  const protectedRoutes = ["/dashboard", "/learn", "/premium", "/shop", "/lesson", "/courses"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.includes(route)
  );
  const isApiRoute = pathname.startsWith("/api/");

  if (isProtectedRoute && !isApiRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
