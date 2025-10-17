import { NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/((?!api|_next/|favicon.ico|assets/|template/).*)',
  ],
};

export function middleware(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Serve the static site built from NewWebSite for marketing routes
  const marketingRoutes = new Set(['/', '/services', '/contact']);
  if (marketingRoutes.has(path)) {
    return NextResponse.rewrite(new URL('/original-index.html', url));
  }

  // Lock public access: ensure documents sont sous /internal/*
  if (path === '/documents') {
    return NextResponse.redirect(new URL('/internal/documents', url));
  }

  return NextResponse.next();
}
