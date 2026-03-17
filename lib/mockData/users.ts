export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio?: string;
  level: number;
  xp: number;
  region: string;
  platforms: string[];
  isVerified: boolean;
  isCreator: boolean;
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'progamer123',
    displayName: 'ProGamer',
    avatar: 'https://images.pexels.com/photos/7915286/pexels-photo-7915286.jpeg?auto=compress&w=150',
    bio: 'Competitive FPS player | Streamer | Coach',
    level: 45,
    xp: 23400,
    region: 'NA',
    platforms: ['PC', 'Console'],
    isVerified: true,
    isCreator: true,
  },
  {
    id: '2',
    username: 'cybermage',
    displayName: 'CyberMage',
    avatar: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&w=150',
    bio: 'Content creator',
    level: 38,
    xp: 18900,
    region: 'EU',
    platforms: ['PC'],
    isVerified: true,
    isCreator: true,
  },
  {
    id: '3',
    username: 'shadowwolf',
    displayName: 'ShadowWolf',
    avatar: 'https://images.pexels.com/photos/9072319/pexels-photo-9072319.jpeg?auto=compress&w=150',
    bio: 'Competitive player',
    level: 52,
    xp: 31200,
    region: 'ASIA',
    platforms: ['PC', 'Console'],
    isVerified: false,
    isCreator: false,
  },
];

export function getCurrentUser(): User {
  return mockUsers[0];
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find((u) => u.id === id);
}
