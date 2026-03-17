import { NextResponse } from 'next/server'
import { MediaService } from '@/lib/services/media.service'

export async function GET() {
  try {
    const service = new MediaService()
    const data = await service.getGallery()

    return NextResponse.json(data)
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Failed to load media' },
      { status: 500 }
    )
  }
}
