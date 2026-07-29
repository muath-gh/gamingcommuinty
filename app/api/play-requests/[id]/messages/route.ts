// app/api/play-requests/[id]/messages/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PlayRequestService } from "@/lib/services/play-requests.service";

const service = new PlayRequestService();

// ✅ GET - جلب الرسائل
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const messages = await service.getMessages(params.id);

    return NextResponse.json({
      success: true,
      messages,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل جلب الرسائل" },
      { status: 400 },
    );
  }
}

// ✅ POST - إرسال رسالة جديدة
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await request.json();

    if (!content?.trim()) {
      return NextResponse.json({ error: "الرسالة فارغة" }, { status: 400 });
    }

    const message = await service.sendMessage(params.id, userId, content);

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل إرسال الرسالة" },
      { status: 400 },
    );
  }
}
