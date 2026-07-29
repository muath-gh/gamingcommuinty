import { NextResponse } from "next/server";
import { NewsService } from "@/lib/services/news.service";

const service = new NewsService();

export async function GET() {
  try {
    const allNews = await service.getLatestNews(3);

    return NextResponse.json({
      success: true,
      news: allNews,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "فشل جلب الأخبار" },
      { status: 500 },
    );
  }
}
