import { NextResponse } from 'next/server'
import { GameService } from '../../../lib/services/games.service'

const service = new GameService()

export async function GET() {
  const games = await service.getGamesForSelect()
  return NextResponse.json(games)
}
