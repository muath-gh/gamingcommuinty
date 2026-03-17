import { NextResponse } from 'next/server'
import { NewsService } from '@/lib/services/news.service'

export async function GET() {
  const service = new NewsService()
  const data = await service.getNews()

  return NextResponse.json({
    success: true,
    data,
  })
}
