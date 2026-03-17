export interface PlayRequestDTO {
  id: string
  title: string
  description: string | null
  playersNeeded: number
  isOpen: boolean
  createdAt: Date

  user: {
    id: string
    name: string
    avatar: string | null
  }

  game: {
    id: string
    name: string
  }

  participants: {
    id: string
    userId: string
  }[]
}
