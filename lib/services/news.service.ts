import { NewsRepository } from '@/lib/repositories/news.repository'
import { NewsDTO } from '@/lib/dto/news.dto'

export class NewsService {
  private repo = new NewsRepository()

  async getNews() {
    const [featured, regular] = await Promise.all([
      this.repo.getFeatured(),
      this.repo.getAll(),
    ])

    return {
      featured: featured.map(this.toDTO),
      regular: regular.map(this.toDTO),
    }
  }

  private toDTO(news: any): NewsDTO {
    return {
      id: news.id,
      title: news.title,
      slug: news.slug,
      excerpt: news.excerpt,
      category: news.category,
      isFeatured: news.isFeatured,
      viewsCount: news.viewsCount,
      likesCount: news.likesCount,
      createdAt: news.createdAt.toISOString(),
      author: {
        id: news.author.id,
        name: news.author.name,
        avatar: news.author.avatar,
      },
      tags: news.tags,
    }
  }
}
