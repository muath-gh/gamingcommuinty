import { prisma } from '@/lib/prisma/prisma'

export class MediaRepository {
  async findAll() {
    return prisma.mediaItem.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatar: true },
        },
        game: {
          select: { id: true, name: true },
        },
      },
    })
  }

  async findTrending(limit = 3) {
    return prisma.mediaItem.findMany({
      where: { isTrending: true, published: true },
      take: limit,
      orderBy: { viewsCount: 'desc' },
      include: {
        author: { select: { id: true, name: true, avatar: true } },
        game: { select: { id: true, name: true } },
      },
    })
  }
}
