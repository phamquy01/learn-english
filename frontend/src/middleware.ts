import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/translate'];
const authPaths = ['/register', '/login'];
export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get('sessionToken');
  const { pathname } = request.nextUrl;

  if (privatePaths.some((path) => pathname.startsWith(path)) && !sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authPaths.some((path) => pathname.startsWith(path)) && sessionToken) {
    return NextResponse.redirect(new URL('/translate', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/register', '/login', '/translate'],
};
