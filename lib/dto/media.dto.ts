export interface MediaDTO {
  id: string
  title: string
  type: 'image' | 'video'
  url: string
  thumbnail: string | null
  viewsCount: number
  likesCount: number
  commentsCount: number
  isTrending: boolean
  createdAt: string

  author: {
    id: string
    name: string
    avatar: string | null
  }

  game: {
    id: string
    name: string
  } | null
}
