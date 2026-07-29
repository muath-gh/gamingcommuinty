import { prisma } from '../prisma/prisma'

export class PlatformRepository {
  async getAll() {
    return prisma.platform.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    })
  }

  async findById(id: string) {
    return prisma.platform.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    })
  }

  async findBySlug(slug: string) {
    return prisma.platform.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        icon: true,
      },
    })
  }
}