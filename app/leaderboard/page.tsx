'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Zap, Crown, Medal } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { mockUsers } from '@/lib/mockData';

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('weekly');

  const sortedUsers = [...mockUsers]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const topThree = sortedUsers.slice(0, 3);
  const restOfLeaders = sortedUsers.slice(3, 50);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Leaderboard</h1>
          <p className="text-xl text-slate-400">Top players in the community</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {(['daily', 'weekly', 'monthly', 'allTime'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timeFilter === filter
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {filter === 'allTime' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((user, index) => {
            const isFirst = index === 0;
            const colors = ['yellow', 'slate', 'orange'];
            const icons = [Crown, Medal, Medal];
            const Icon = icons[index];

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={isFirst ? 'md:col-span-3 md:order-first' : ''}
              >
                <GamingCard gradient glow className={isFirst ? 'border-2 border-yellow-500' : ''}>
                  <div className={`p-8 text-center ${isFirst ? 'pb-12' : ''}`}>
                    <div className="relative inline-block mb-4">
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className={`${isFirst ? 'w-32 h-32' : 'w-24 h-24'} rounded-full border-4 border-${colors[index]}-500`}
                      />
                      <div className={`absolute -top-2 -right-2 w-12 h-12 bg-${colors[index]}-500 rounded-full flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div className={`text-6xl font-bold text-${colors[index]}-500 mb-2`}>
                      #{user.rank}
                    </div>
                    <h3 className={`${isFirst ? 'text-3xl' : 'text-2xl'} font-bold mb-2`}>
                      {user.displayName}
                    </h3>
                    <p className="text-slate-400 mb-4">@{user.username}</p>
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{user.level}</div>
                        <div className="text-xs text-slate-400">Level</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-400">{user.xp.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">Total XP</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pink-400">{parseInt(user.id) * 3 + 5}</div>
                        <div className="text-xs text-slate-400">Badges</div>
                      </div>
                    </div>
                  </div>
                </GamingCard>
              </motion.div>
            );
          })}
        </div>

        <GamingCard>
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Rankings</h2>
            <div className="space-y-3">
              {restOfLeaders.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="w-12 text-center">
                    <span className="text-2xl font-bold text-slate-400">#{user.rank}</span>
                  </div>
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-14 h-14 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{user.displayName}</h3>
                    <p className="text-sm text-slate-400">@{user.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-bold">Level {user.level}</span>
                    </div>
                    <div className="text-sm text-slate-400">{user.xp.toLocaleString()} XP</div>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="success" size="sm">Top Player</Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GamingCard>
      </motion.div>
    </PageContainer>
  );
}
