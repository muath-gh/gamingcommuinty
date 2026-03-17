import { GameRepository } from '../repositories/games.repository'
import { GameDTO } from '../dto/game.dto'

export class GameService {
  private repo = new GameRepository()

  async getGamesForSelect(): Promise<GameDTO[]> {
    const games = await this.repo.getAll()
    return games.map(this.toDTO)
  }

  async validateGame(gameId: string): Promise<boolean> {
    const game = await this.repo.findById(gameId)
    return !!game
  }

  private toDTO(game: any): GameDTO {
    return {
      id: game.id,
      name: game.name,
      slug: game.slug,
    }
  }
}
