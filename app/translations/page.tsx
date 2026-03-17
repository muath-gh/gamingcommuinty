'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Languages, ThumbsUp, ThumbsDown, DollarSign, CheckCircle2, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { mockGames, mockUsers } from '@/lib/mockData';

interface Translation {
  id: string;
  gameId: string;
  originalText: string;
  translatedText: string;
  contributor: string;
  votes: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

const mockTranslations: Translation[] = [
  {
    id: 't1',
    gameId: 'g1',
    originalText: 'Start Game',
    translatedText: 'ابدأ اللعبة',
    contributor: '1',
    votes: 15,
    status: 'approved',
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 't2',
    gameId: 'g1',
    originalText: 'Settings',
    translatedText: 'الإعدادات',
    contributor: '2',
    votes: 12,
    status: 'approved',
    createdAt: '2024-01-06T14:30:00Z',
  },
  {
    id: 't3',
    gameId: 'g2',
    originalText: 'Character Selection',
    translatedText: 'اختيار الشخصية',
    contributor: '3',
    votes: 8,
    status: 'pending',
    createdAt: '2024-01-07T09:15:00Z',
  },
];

export default function TranslationsPage() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [showContributeModal, setShowContributeModal] = useState(false);

  const filteredTranslations = mockTranslations.filter(
    t => filter === 'all' || t.status === filter
  );

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Arabic Translations</h1>
          <p className="text-xl text-slate-400">Help localize games for Arabic-speaking players</p>
        </div>

        <GamingCard gradient glow className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Languages className="w-24 h-24 text-blue-500" />
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Contribute Translations</h2>
              <p className="text-slate-300 mb-6">
                Join our localization community and help make games accessible to millions of Arabic speakers. Earn XP, badges, and receive donations from grateful players!
              </p>
              <div className="flex gap-4">
                <GamingButton size="lg" glow onClick={() => setShowContributeModal(true)}>
                  Submit Translation
                </GamingButton>
                <GamingButton variant="ghost" size="lg">
                  Translation Guide
                </GamingButton>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">2,500+</div>
                <div className="text-sm text-slate-400">Translations</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">150+</div>
                <div className="text-sm text-slate-400">Contributors</div>
              </div>
            </div>
          </div>
        </GamingCard>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            {(['all', 'pending', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <select className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500">
            <option>All Games</option>
            {mockGames.map(game => (
              <option key={game.id}>{game.title}</option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredTranslations.map((translation, index) => {
            const game = mockGames.find(g => g.id === translation.gameId);
            const contributor = mockUsers.find(u => u.id === translation.contributor);

            return (
              <motion.div
                key={translation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GamingCard hover>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <img
                          src={game?.coverImage}
                          alt={game?.title}
                          className="w-16 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold">{game?.title}</h3>
                            <Badge
                              variant={
                                translation.status === 'approved' ? 'success' :
                                translation.status === 'pending' ? 'warning' : 'danger'
                              }
                              glow={translation.status === 'approved'}
                            >
                              {translation.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {translation.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                              {translation.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-slate-400">
                            <img
                              src={contributor?.avatar}
                              alt={contributor?.displayName}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{contributor?.displayName}</span>
                            <span>•</span>
                            <span>{new Date(translation.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div className="p-4 bg-slate-800/30 rounded-lg">
                        <div className="text-sm text-slate-400 mb-2">Original (English)</div>
                        <div className="text-lg font-semibold">{translation.originalText}</div>
                      </div>
                      <div className="p-4 bg-slate-800/30 rounded-lg">
                        <div className="text-sm text-slate-400 mb-2">Translation (Arabic)</div>
                        <div className="text-lg font-semibold text-right" dir="rtl">
                          {translation.translatedText}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{translation.votes}</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors">
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                      <GamingButton variant="accent" size="sm">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Tip Contributor
                      </GamingButton>
                    </div>
                  </div>
                </GamingCard>
              </motion.div>
            );
          })}
        </div>

        <GamingCard>
          <div className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Top Contributors This Month</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mockUsers.slice(0, 3).map((user, index) => (
                <div key={user.id} className="p-6 bg-slate-800/30 rounded-lg">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-blue-500"
                  />
                  <h4 className="font-bold text-lg mb-2">{user.displayName}</h4>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {parseInt(user.id) * 45 + 120}
                  </div>
                  <div className="text-sm text-slate-400">Translations</div>
                </div>
              ))}
            </div>
          </div>
        </GamingCard>
      </motion.div>
    </PageContainer>
  );
}
