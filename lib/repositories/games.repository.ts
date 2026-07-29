import { prisma } from "../prisma/prisma";
export class GameRepository {
  async getAll() {
    return prisma.game.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.game.findUnique({
      where: { id },
      select: { id: true },
    });
  }
  async search(query: string) {
    return prisma.game.findMany({
      where: {
        OR: [{ name: { startsWith: query } }, { slug: { startsWith: query } }],
      },
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 10,
    });
  }
  async getPopular(limit = 8) {
    return prisma.game.findMany({
      take: limit,
      where: {
        playRequests: {
          some: {}, // فقط الألعاب اللي فيها playRequests واحد على الأقل
        },
      },
      orderBy: {
        playRequests: { _count: "desc" },
      },
      select: {
        id: true,
        name: true,
        slug: true,
        _count: {
          select: { playRequests: true },
        },
      },
    });
  }
}
