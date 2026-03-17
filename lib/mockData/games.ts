export interface Game {
  id: string;
  slug: string;
  title: string;
  coverImage: string;
  rating: number;
  playerCount: string;
  trending: boolean;
  genre: string[];
}

export const mockGames: Game[] = [
  {
    id: '1',
    slug: 'apex-legends',
    title: 'Apex Legends',
    coverImage: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&w=600',
    rating: 4.5,
    playerCount: '50M+',
    trending: true,
    genre: ['Battle Royale', 'FPS'],
  },
  {
    id: '2',
    slug: 'valorant',
    title: 'Valorant',
    coverImage: 'https://images.pexels.com/photos/7915286/pexels-photo-7915286.jpeg?auto=compress&w=600',
    rating: 4.7,
    playerCount: '20M+',
    trending: true,
    genre: ['Tactical Shooter', 'FPS'],
  },
  {
    id: '3',
    slug: 'elden-ring',
    title: 'Elden Ring',
    coverImage: 'https://images.pexels.com/photos/9072319/pexels-photo-9072319.jpeg?auto=compress&w=600',
    rating: 4.9,
    playerCount: '15M+',
    trending: false,
    genre: ['RPG', 'Action'],
  },
  {
    id: '4',
    slug: 'league-of-legends',
    title: 'League of Legends',
    coverImage: 'https://images.pexels.com/photos/7048041/pexels-photo-7048041.jpeg?auto=compress&w=600',
    rating: 4.6,
    playerCount: '100M+',
    trending: true,
    genre: ['MOBA', 'Strategy'],
  },
];

export function getGameById(id: string): Game | undefined {
  return mockGames.find((g) => g.id === id);
}

export function getGameBySlug(slug: string): Game | undefined {
  return mockGames.find((g) => g.slug === slug);
}

export function getTrendingGames(): Game[] {
  return mockGames.filter((g) => g.trending);
}

export function getFeaturedGames(): Game[] {
  return mockGames.slice(0, 4);
}
