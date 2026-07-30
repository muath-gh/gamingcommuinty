import { GameService } from "../../../../lib/services/games.service";
import { NextResponse, NextRequest } from "next/server";
export const dynamic = "force-dynamic";
const service = new GameService();

export async function GET(request: NextRequest) {
  const multiplayerOnly =
    request.nextUrl.searchParams.get("type") === "multiplayer";
  const games = await service.getPopularGames(8, multiplayerOnly);
  return NextResponse.json(games);
}
