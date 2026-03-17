import { prisma } from '../prisma/prisma'
export class GameRepository {
  async getAll() {
    return prisma.game.findMany({
      orderBy: {
        name: 'asc',
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    })
  }

  async findById(id: string) {
    return prisma.game.findUnique({
      where: { id },
      select: { id: true },
    })
  }
}
