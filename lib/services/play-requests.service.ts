// services/play-requests.service.ts
import { PlayRequestRepository } from "../repositories/play-requests.repository";
import { PlayRequestDTO } from "../dto/play-request.dto";

export class PlayRequestService {
  private repo = new PlayRequestRepository();

  async listAll(): Promise<PlayRequestDTO[]> {
    const items = await this.repo.getAll();
    return items.map(this.toDTO);
  }
  async getById(id: string) {
    return this.repo.getById(id); // ✅
  }
  async create(data: {
    title: string;
    description?: string;
    playersNeeded: number;
    gameId: string;
    userId: string;
  }): Promise<PlayRequestDTO> {
    const item = await this.repo.create(data);
    return this.toDTO(item);
  }
  async delete(id: string, userId: string): Promise<void> {
    // تأكد أن المستخدم هو المالك
    const request = await this.repo.findById(id);
    if (!request) throw new Error("الطلب غير موجود");

    if (request.userId !== userId) {
      throw new Error("ليس لديك صلاحية لحذف هذا الطلب");
    }

    await this.repo.delete(id);
  }

  async joinRequest(requestId: string, userId: string) {
    return this.repo.joinRequest(requestId, userId);
  }

  async leaveRequest(requestId: string, userId: string) {
    return this.repo.leaveRequest(requestId, userId); // ✅ فقط الـ repo
  }

  async sendMessage(requestId: string, userId: string, content: string) {
    return this.repo.sendMessage(requestId, userId, content);
  }

  async getMessages(requestId: string) {
    return this.repo.getMessages(requestId);
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
    };
  }
}
