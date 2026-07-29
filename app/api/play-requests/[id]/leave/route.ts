// app/api/play-requests/[id]/leave/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PlayRequestService } from "@/lib/services/play-requests.service";

const service = new PlayRequestService();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = request.headers.get("x-user-id"); // ✅

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await service.leaveRequest(params.id, userId); // ✅ استخدم الـ service

    return NextResponse.json({
      success: true,
      message: "تم المغادرة بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل المغادرة" },
      { status: 400 },
    );
  }
}
