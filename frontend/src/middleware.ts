import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const privatePaths = ['/users', '/translate'];
const authPaths = ['/register', '/login'];
export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  const { pathname } = request.nextUrl;

  if (privatePaths.some((path) => pathname.startsWith(path)) && !accessToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authPaths.some((path) => pathname.startsWith(path)) && accessToken) {
    return NextResponse.redirect(new URL('/translate', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/register', '/login', '/users', '/translate'],
};
