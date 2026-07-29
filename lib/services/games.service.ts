import { GameRepository } from "../repositories/games.repository";
import { GameDTO, PopularGameDTO } from "../dto/game.dto";

export class GameService {
  private repo = new GameRepository();

  async getGamesForSelect(): Promise<GameDTO[]> {
    const games = await this.repo.getAll();
    return games.map(this.toDTO);
  }

  async validateGame(gameId: string): Promise<boolean> {
    const game = await this.repo.findById(gameId);
    return !!game;
  }

  private toDTO(game: any): GameDTO {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
    };
  }

  async getPopularGames(limit = 8): Promise<PopularGameDTO[]> {
    const games = await this.repo.getPopular(limit);
    return games.map(this.toPopularDTO);
  }
  async searchGames(query: string): Promise<GameDTO[]> {
    const games = await this.repo.search(query.trim());
    return games.map(this.toDTO);
  }
  private toPopularDTO(game: any): PopularGameDTO {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
      playRequestsCount: game._count.playRequests,
    };
  }
}
