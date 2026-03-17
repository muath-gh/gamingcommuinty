import { NextResponse } from 'next/server'
import { PlayRequestParticipantService } from '@/lib/services/play-request-participants.service'

const service = new PlayRequestParticipantService()

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await req.json()

  const result = await service.join(params.id, userId)
  return NextResponse.json(result)
}
