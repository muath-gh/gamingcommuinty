import { NextResponse, NextRequest } from "next/server";
import { GameService } from "../../../lib/services/games.service";

export const dynamic = "force-dynamic";

const service = new GameService();

export async function GET(request: NextRequest) {
  const multiplayerOnly =
    request.nextUrl.searchParams.get("type") === "multiplayer";
  const service = new GameService();
  const games = await service.getGamesForSelect(multiplayerOnly);
  return NextResponse.json(games);
}
