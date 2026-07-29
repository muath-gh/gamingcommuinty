// repositories/play-requests.repository.ts
import { prisma } from "../prisma/prisma";

export class PlayRequestRepository {
  async getAll() {
    return prisma.playRequest.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        playersNeeded: true,
        isOpen: true,
        createdAt: true,

        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },

        game: {
          select: {
            id: true,
            name: true,
          },
        },

        participants: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });
  }

  async create(data: {
    title: string;
    description?: string;
    playersNeeded: number;
    gameId: string;
    userId: string;
  }) {
    return prisma.playRequest.create({
      data,
      select: {
        id: true,
        title: true,
        description: true,
        playersNeeded: true,
        isOpen: true,
        createdAt: true,
        user: {
          select: { id: true, name: true, avatar: true },
        },
        game: {
          select: { id: true, name: true },
        },
        participants: {
          select: { id: true, userId: true },
        },
      },
    });
  }
  async delete(id: string) {
    return prisma.playRequest.delete({
      where: { id },
    });
  }
  async findById(id: string) {
    return prisma.playRequest.findUnique({
      where: { id },
      select: {
        id: true,
        userId: true, // ✅ أضيف هاي
        playersNeeded: true,
        isOpen: true,
      },
    });
  }

  async joinRequest(requestId: string, userId: string) {
    // تحقق من الطلب
    const request = await prisma.playRequest.findUnique({
      where: { id: requestId },
      include: { participants: true },
    });

    if (!request) throw new Error("الطلب غير موجود");
    if (!request.isOpen) throw new Error("الطلب مغلق");

    // تحقق إذا كان بالفعل انضم
    const existing = await prisma.playRequestParticipant.findUnique({
      where: {
        playRequestId_userId: {
          playRequestId: requestId,
          userId,
        },
      },
    });

    if (existing) throw new Error("أنت بالفعل في هذا الطلب");

    // أضيفه كمشارك
    const participant = await prisma.playRequestParticipant.create({
      data: {
        playRequestId: requestId,
        userId,
        status: "JOINED",
      },
      include: { user: true },
    });

    // تحقق إذا الطلب امتلأ
    const updatedRequest = await prisma.playRequest.findUnique({
      where: { id: requestId },
      include: { participants: true },
    });

    if (updatedRequest!.participants.length === updatedRequest!.playersNeeded) {
      await prisma.playRequest.update({
        where: { id: requestId },
        data: { isOpen: false },
      });
    }

    return participant;
  }

  async leaveRequest(requestId: string, userId: string) {
    // احذف الـ participant
    await prisma.playRequestParticipant.delete({
      where: {
        playRequestId_userId: {
          playRequestId: requestId,
          userId,
        },
      },
    });

    // احصل على الطلب الحالي
    const request = await prisma.playRequest.findUnique({
      where: { id: requestId },
      include: { participants: true },
    });

    if (!request) throw new Error("الطلب غير موجود");

    // إذا كان في مكان فارغ، افتح الطلب
    const isFull = request.participants.length >= request.playersNeeded;

    if (!isFull && !request.isOpen) {
      await prisma.playRequest.update({
        where: { id: requestId },
        data: { isOpen: true },
      });
    }

    return request;
  }
  async getById(id: string) {
    return prisma.playRequest.findUnique({
      where: { id },
      include: {
        game: true,
        user: true,
        participants: {
          include: { user: true },
        },
      },
    });
  }
  async sendMessage(requestId: string, userId: string, content: string) {
    return prisma.playRequestMessage.create({
      data: {
        playRequestId: requestId,
        userId,
        content,
      },
      include: { user: true },
    });
  }

  async getMessages(requestId: string, limit: number = 50) {
    return prisma.playRequestMessage.findMany({
      where: { playRequestId: requestId },
      include: { user: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  }
}
