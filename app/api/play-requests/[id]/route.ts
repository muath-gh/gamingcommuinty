import { NextResponse, NextRequest } from "next/server";
import { getUser } from "@/lib/get-user";
import { PlayRequestService } from "@/lib/services/play-requests.service";
const service = new PlayRequestService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const playRequest = await service.getById(params.id); // ✅ عبر الـ service

    if (!playRequest) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ playRequest });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log("DELETE called with id:", params.id);

  try {
    const userId = request.headers.get("x-user-id"); // ✅ احصل من الـ header
    console.log("User ID:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await service.delete(params.id, userId);

    return NextResponse.json({
      success: true,
      message: "تم حذف الطلب بنجاح",
    });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: error.message || "فشل الحذف" },
      { status: 400 },
    );
  }
}
