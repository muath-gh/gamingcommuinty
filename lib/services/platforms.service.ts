import { PlatformRepository } from '../repositories/platforms.repository'

export type PlatformDTO = {
  id: string
  name: string
  slug: string
  icon: string | null
}

export class PlatformService {
  private repo = new PlatformRepository()

  async getAll(): Promise<PlatformDTO[]> {
    const platforms = await this.repo.getAll()
    return platforms.map(this.toDTO)
  }

  async findById(id: string): Promise<PlatformDTO | null> {
    const platform = await this.repo.findById(id)
    if (!platform) return null
    return this.toDTO(platform)
  }

  async findBySlug(slug: string): Promise<PlatformDTO | null> {
    const platform = await this.repo.findBySlug(slug)
    if (!platform) return null
    return this.toDTO(platform)
  }

  private toDTO(platform: any): PlatformDTO {
    return {
      id: platform.id,
      name: platform.name,
      slug: platform.slug,
      icon: platform.icon ?? null,
    }
  }
}