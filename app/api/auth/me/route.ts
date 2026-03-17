// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // جيب الـ token من الـ cookies
    const token = request.cookies.get('auth-token')?.value;

    // إذا ما في token، المستخدم مش مسجل دخول
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    // تحقق من صلاحية الـ token
    let decoded;
    try {
      decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-this'
      ) as { userId: string; username: string; email: string };
    } catch (error) {
      // الـ token منتهي أو غير صالح
      return NextResponse.json(
        { error: 'الجلسة منتهية' },
        { status: 401 }
      );
    }

    // جيب بيانات المستخدم من الـ database
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatar: true,
      },
    });

    // إذا المستخدم مش موجود في الـ database
    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // كل شي تمام، ارجع بيانات المستخدم
    return NextResponse.json(
      {
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب بيانات المستخدم' },
      { status: 500 }
    );
  }
}