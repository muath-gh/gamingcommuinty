import { NextResponse, NextRequest } from "next/server";
import { PlayRequestService } from "@/lib/services/play-requests.service";
import { getSocket } from "@/lib/socket/socket";

const service = new PlayRequestService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const playRequest = await service.getById(params.id);
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
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await service.delete(params.id, userId);

    try {
      getSocket().emit("request-deleted", { requestId: params.id });
    } catch {
      console.log("Socket not initialized yet");
    }

    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل الحذف" },
      { status: 400 },
    );
  }
}
