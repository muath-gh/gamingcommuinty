export interface GameDTO {
  id: string
  name: string
  slug: string
}

export type PopularGameDTO = GameDTO & {
  playRequestsCount: number
}
