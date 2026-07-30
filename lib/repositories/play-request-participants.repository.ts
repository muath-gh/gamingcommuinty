// repositories/play-request-participants.repository.ts
import { prisma } from '../prisma/prisma'

export class PlayRequestParticipantRepository {
  async join(requestId: string, userId: string) {
    return prisma.playRequestParticipant.create({
      data: {
        playRequestId: requestId,
        userId,
      },
      select: { id: true },
    })
  }

  async countAccepted(requestId: string) {
    return prisma.playRequestParticipant.count({
      where: {
        playRequestId: requestId,
        status: 'JOINED',
      },
    })
  }
}
