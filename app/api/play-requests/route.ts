import { NextResponse } from "next/server";
import { PlayRequestService } from "@/lib/services/play-requests.service";
import { headers } from "next/headers";

const service = new PlayRequestService();

export async function GET() {
  const requests = await service.listAll();
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const authRes = await fetch(`${process.env.NEXT_APP_URL}/api/auth/me`, {
    headers: {
      cookie: headers().get("cookie") ?? "",
    },
  });
  if (!authRes.ok) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { user } = await authRes.json();

  const body = await req.json();

  if (!body.title || !body.description || !body.playersNeeded || !body.gameId) {
    return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
  }
  console.log("user", user);
  const playRequest = await service.create({
    title: body.title,
    description: body.description,
    playersNeeded: body.playersNeeded,
    gameId: body.gameId,
    userId: user.id,
  });

  return NextResponse.json(playRequest);
}
