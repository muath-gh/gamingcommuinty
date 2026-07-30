import { NextResponse, NextRequest } from "next/server";
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

    const participant = await service.joinRequest(params.id, userId);

    try {
      getSocket().emit("player-joined-request", {
        requestId: params.id,
        participant,
      });
    } catch {
      console.log("Socket not initialized yet");
    }

    return NextResponse.json({
      success: true,
      participant,
      message: "تم الانضمام بنجاح",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل الانضمام" },
      { status: 400 },
    );
  }
}
