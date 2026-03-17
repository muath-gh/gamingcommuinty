// services/play-request-participants.service.ts
import { PlayRequestParticipantRepository } from '../repositories/play-request-participants.repository'

export class PlayRequestParticipantService {
  private repo = new PlayRequestParticipantRepository()

  async join(requestId: string, userId: string) {
    return this.repo.join(requestId, userId)
  }
}
