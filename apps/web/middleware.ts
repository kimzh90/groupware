import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('role')?.value;
  const { pathname } = request.nextUrl;

  // 루트 페이지 → 토큰 여부에 따라 리다이렉트
  if (pathname === '/') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 로그인 페이지: 이미 로그인된 경우 대시보드로
  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 대시보드: 미인증 시 로그인으로
  if (pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 관리자 페이지: SUPER_ADMIN 또는 ADMIN만 접근 가능
  if (pathname.startsWith('/dashboard/admin') && userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
