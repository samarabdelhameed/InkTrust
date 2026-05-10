import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');
  
  // Example RBAC check: Redirect to login if no auth token is found
  // (In production, you'd use Privy's server-side validation here)
  const token = request.cookies.get('privy-token');

  if (!token && !isAuthPage) {
    // return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
