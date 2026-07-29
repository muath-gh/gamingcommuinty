export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { PlatformService } from '../../../lib/services/platforms.service'

const service = new PlatformService()

export async function GET() {
  const platforms = await service.getAll()
  return NextResponse.json(platforms)
}