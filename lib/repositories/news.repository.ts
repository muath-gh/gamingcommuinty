import { prisma } from '../prisma/prisma'

export class NewsRepository {
  async getFeatured() {
    return prisma.news.findMany({
      where: {
        published: true,
        isFeatured: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 2,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: true,
      },
    })
  }

  async getAll() {
    return prisma.news.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        author: true,
      },
    })
  }
}
