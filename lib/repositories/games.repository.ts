import { prisma } from "../prisma/prisma";

type GameFilter = {
  gameType?: string;
};

export class GameRepository {
  async getAll(filter: GameFilter = {}) {
    return prisma.game.findMany({
      where: {
        ...(filter.gameType ? { gameType: filter.gameType } : {}),
      },
      orderBy: { name: "asc" },
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

  async findByIdWithFilter(id: string, filter: GameFilter = {}) {
    return prisma.game.findFirst({
      where: {
        id,
        ...(filter.gameType ? { gameType: filter.gameType } : {}),
      },
      select: { id: true },
    });
  }

  async search(query: string, filter: GameFilter = {}) {
    return prisma.game.findMany({
      where: {
        ...(filter.gameType ? { gameType: filter.gameType } : {}),
        OR: [{ name: { startsWith: query } }, { slug: { startsWith: query } }],
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
      take: 10,
    });
  }

  async getPopular(limit = 8, filter: GameFilter = {}) {
    return prisma.game.findMany({
      take: limit,
      where: {
        ...(filter.gameType ? { gameType: filter.gameType } : {}),
        playRequests: {
          some: {},
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
