import { MediaRepository } from '@/lib/repositories/media.repository'
import { MediaDTO } from '../../lib/dto/media.dto'

export class MediaService {
  private repo = new MediaRepository()

  async getGallery() {
    const [all, trending] = await Promise.all([
      this.repo.findAll(),
      this.repo.findTrending(),
    ])

    return {
      all: all.map(this.toDTO),
      trending: trending.map(this.toDTO),
    }
  }

  private toDTO(media: any): MediaDTO {
    return {
      id: media.id,
      title: media.title,
      type: media.type,
      url: media.url,
      thumbnail: media.thumbnail,
      viewsCount: media.viewsCount,
      likesCount: media.likesCount,
      commentsCount: media.commentsCount,
      isTrending: media.isTrending,
      createdAt: media.createdAt.toISOString(),

      author: {
        id: media.author.id,
        name: media.author.name,
        avatar: media.author.avatar,
      },

      game: media.game
        ? {
            id: media.game.id,
            name: media.game.name,
          }
        : null,
    }
  }
}
