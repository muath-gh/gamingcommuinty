import { GameRepository } from "../repositories/games.repository";
import { GameDTO, PopularGameDTO } from "../dto/game.dto";

export class GameService {
  private repo = new GameRepository();

  async getGamesForSelect(multiplayerOnly = false): Promise<GameDTO[]> {
    const games = await this.repo.getAll(
      multiplayerOnly ? { gameType: "multiplayer" } : {},
    );
    return games.map(this.toDTO);
  }

  async validateGame(
    gameId: string,
    multiplayerOnly = false,
  ): Promise<boolean> {
    const game = await this.repo.findByIdWithFilter(
      gameId,
      multiplayerOnly ? { gameType: "multiplayer" } : {},
    );
    return !!game;
  }

  private toDTO(game: any): GameDTO {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
    };
  }

  async getPopularGames(
    limit = 8,
    multiplayerOnly = false,
  ): Promise<PopularGameDTO[]> {
    const games = await this.repo.getPopular(
      limit,
      multiplayerOnly ? { gameType: "multiplayer" } : {},
    );
    return games.map(this.toPopularDTO);
  }

  async searchGames(
    query: string,
    multiplayerOnly = false,
  ): Promise<GameDTO[]> {
    const games = await this.repo.search(
      query.trim(),
      multiplayerOnly ? { gameType: "multiplayer" } : {},
    );
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
