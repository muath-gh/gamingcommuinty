// app/api/games/search/route.ts
import { GameService } from "../../../../lib/services/games.service";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q") || "";
  const isMultiPlayer = searchParams.get("type") === "multiplayer";

  if (q.length < 1) {
    return Response.json([]);
  }

  try {
    const gameService = new GameService();
    const games = await gameService.searchGames(q, isMultiPlayer);
    return Response.json(games);
  } catch (error) {
    console.error("Search error:", error); // ← أضف هني
    return Response.json(
      {
        error: "Search failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
