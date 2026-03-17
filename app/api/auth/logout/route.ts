// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // إنشاء الـ response
    const response = NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الخروج بنجاح',
      },
      { status: 200 }
    );

    // حذف الـ auth cookie عن طريق تعيين maxAge = 0
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // هذا يحذف الـ cookie
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الخروج' },
      { status: 500 }
    );
  }
}