// app/api/media/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma/prisma';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { GameService } from '../../../../lib/services/games.service'
export async function POST(request: NextRequest) {
  try {
    const gameService = new GameService()
    // التحقق من المستخدم
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-this'
    ) as { userId: string };

    // استقبال البيانات
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as 'image' | 'video';
    const rawGameId = formData.get('gameId') as string;
const gameId =
  rawGameId && rawGameId !== 'undefined' && rawGameId !== ''
    ? rawGameId
    : null

if (gameId) {
  const valid = await gameService.validateGame(gameId)
  if (!valid) {
    return NextResponse.json(
      { error: 'اللعبة غير موجودة' },
      { status: 400 }
    )
  }
}
    const isFeatured = formData.get('isFeatured') === 'true';
    const tags = JSON.parse(formData.get('tags') as string || '[]');
    const file = formData.get('file') as File;

    // Validation
    if (!title || !file || !type) {
      return NextResponse.json(
        { error: 'العنوان والملف ونوع الميديا مطلوبة' },
        { status: 400 }
      );
    }

    // تحقق من نوع الملف
    const allowedTypes = type === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['video/mp4', 'video/webm'];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'نوع الملف غير مدعوم' },
        { status: 400 }
      );
    }

    // تحقق من حجم الملف
    const maxSize = type === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024; // 10MB for images, 100MB for videos
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `حجم الملف يجب أن يكون أقل من ${type === 'image' ? '10' : '100'} ميجابايت` },
        { status: 400 }
      );
    }

    // حفظ الملف
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // إنشاء اسم ملف فريد
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type);
    const filePath = path.join(uploadDir, fileName);

    // تأكد من وجود المجلد
    const fs = require('fs');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // حفظ الملف
    await writeFile(filePath, new Uint8Array(buffer));

    // URL الملف
    const fileUrl = `/uploads/${type}/${fileName}`;

    // إنشاء thumbnail للفيديو (اختياري - يمكن استخدام مكتبة خارجية)
    let thumbnailUrl = type === 'image' ? fileUrl : null;

    // حفظ في Database
    const mediaItem = await prisma.mediaItem.create({
      data: {
        title,
        description,
        type,
        url: fileUrl,
        thumbnail: thumbnailUrl,
        fileSize: file.size,
        isFeatured,
        authorId: decoded.userId,
        gameId: gameId || null,
      },
    });

    // إضافة Tags
    if (tags.length > 0) {
      for (const tagName of tags) {
        // البحث عن الـ tag أو إنشاؤه
        let tag = await prisma.mediaTagItem.findUnique({
          where: { slug: tagName.toLowerCase().replace(/\s+/g, '-') },
        });

        if (!tag) {
          tag = await prisma.mediaTagItem.create({
            data: {
              name: tagName,
              slug: tagName.toLowerCase().replace(/\s+/g, '-'),
            },
          });
        }

        // ربط الـ tag بالميديا
        await prisma.mediaTag.create({
          data: {
            mediaItemId: mediaItem.id,
            tagId: tag.id,
          },
        });
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'تم رفع الميديا بنجاح',
        mediaItem: {
          id: mediaItem.id,
          title: mediaItem.title,
          url: mediaItem.url,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء رفع الملف' },
      { status: 500 }
    );
  }
}