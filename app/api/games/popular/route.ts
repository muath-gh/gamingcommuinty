

import { GameService } from '../../../../lib/services/games.service'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
const service = new GameService()

export async function GET() {
  const games = await service.getPopularGames()
  return NextResponse.json(games)
}