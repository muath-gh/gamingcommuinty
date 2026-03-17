// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  console.log('🔒 Middleware running on:', pathname);

  // إذا المستخدم رايح على /auth
  if (pathname.startsWith('/auth')) {
    if (token) {
      // تحقق من صلاحية الـ token عن طريق الـ API
      try {
        const response = await fetch(new URL('/api/auth/me', request.url), {
          headers: {
            Cookie: `auth-token=${token}`,
          },
        });

        if (response.ok) {
          // الـ token صالح والمستخدم مسجل دخول
          console.log('✅ Valid token, redirecting to home');
          return NextResponse.redirect(new URL('/', request.url));
        } else {
          // الـ token غير صالح، امسحه وخلي المستخدم يدخل
          console.log('❌ Invalid token, clearing and allowing access');
          const response = NextResponse.next();
          response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
          return response;
        }
      } catch (error) {
        // في حالة خطأ، امسح الـ cookie وخلي المستخدم يدخل
        console.log('⚠️ Error checking token, clearing and allowing access');
        const response = NextResponse.next();
        response.cookies.set('auth-token', '', { maxAge: 0, path: '/' });
        return response;
      }
    }
  }

  console.log('➡️ Allowing access');
  return NextResponse.next();
}

export const config = {
  matcher: ['/auth/:path*', '/auth'],
};