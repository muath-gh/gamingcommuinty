import { NextResponse, NextRequest } from "next/server";
import { PlayRequestParticipantService } from "@/lib/services/play-request-participants.service";
import { PlayRequestService } from "@/lib/services/play-requests.service";
const service = new PlayRequestService();
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = request.headers.get("x-user-id"); // ✅ احصل من الـ header

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const participant = await service.joinRequest(params.id, userId);

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
