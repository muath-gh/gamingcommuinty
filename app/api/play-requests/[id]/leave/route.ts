import { NextRequest, NextResponse } from "next/server";
import { PlayRequestService } from "@/lib/services/play-requests.service";
import { getSocket } from "@/lib/socket/socket";

const service = new PlayRequestService();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await service.leaveRequest(params.id, userId);

    try {
      getSocket().emit("player-left-request", {
        requestId: params.id,
        userId,
      });
    } catch {
      console.log("Socket not initialized yet");
    }

    return NextResponse.json({ success: true, message: "تم المغادرة بنجاح" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل المغادرة" },
      { status: 400 },
    );
  }
}
