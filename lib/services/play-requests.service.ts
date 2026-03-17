// services/play-requests.service.ts
import { PlayRequestRepository } from '../repositories/play-requests.repository'
import { PlayRequestDTO } from '../dto/play-request.dto'

export class PlayRequestService {
  private repo = new PlayRequestRepository()

  async listOpen(): Promise<PlayRequestDTO[]> {
    const items = await this.repo.getAllOpen()
    return items.map(this.toDTO)
  }

  async create(data: {
    title: string
    description?: string
    playersNeeded: number
    gameId: string
    userId: string
  }) {
    return this.repo.create(data)
  }

  private toDTO(item: any): PlayRequestDTO {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    playersNeeded: item.playersNeeded,
    isOpen: item.isOpen,
    createdAt: item.createdAt,

    user: item.user,
    game: item.game,
    participants: item.participants,
  }
}
}
