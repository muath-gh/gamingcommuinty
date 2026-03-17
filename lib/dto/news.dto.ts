export interface NewsDTO {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  isFeatured: boolean
  viewsCount: number
  likesCount: number
  createdAt: string

  author: {
    id: string
    name: string
    avatar?: string | null
  }

  tags: {
    tag: {
      name: string
      slug: string
    }
  }[]
}
