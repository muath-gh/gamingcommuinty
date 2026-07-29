'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Crown, Medal } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';
import { mockUsers } from '@/lib/mockData';

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<'daily' | 'weekly' | 'monthly' | 'allTime'>('weekly');

  const sortedUsers = [...mockUsers]
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({ ...user, rank: index + 1 }));

  const topThree = sortedUsers.slice(0, 3);
  const restOfLeaders = sortedUsers.slice(3, 50);

  const rankStyles = [
    { border: 'border-amber-400/50', glow: 'glow-blue', text: 'text-amber-400', bg: 'from-amber-500/10' },
    { border: 'border-cream-muted/30', glow: '', text: 'text-cream-muted', bg: 'from-cream-muted/5' },
    { border: 'border-amber-700/40', glow: '', text: 'text-amber-600', bg: 'from-amber-700/10' },
  ];

  return (
    <PageContainer>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
        <div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">قائمة المتصدرين</h1>
          <p className="text-xl text-cream-muted">أفضل اللاعبين في المجتمع</p>
        </div>

        <div className="flex gap-3 flex-wrap">
          {(['daily', 'weekly', 'monthly', 'allTime'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                timeFilter === filter ? 'btn-primary' : 'btn-ghost'
              }`}
            >
              {filter === 'allTime' ? 'كل الأوقات' : filter === 'daily' ? 'يومي' : filter === 'weekly' ? 'أسبوعي' : 'شهري'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThree.map((user, index) => {
            const isFirst = index === 0;
            const style = rankStyles[index];
            const Icon = index === 0 ? Crown : Medal;

            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={isFirst ? 'md:col-span-3 md:order-first' : ''}
              >
                <GamingCard gradient glow={isFirst} className={`${style.border} ${isFirst ? 'border-2' : 'border'}`}>
                  <div className={`p-8 text-center bg-gradient-to-b ${style.bg} to-transparent`}>
                    <div className="relative inline-block mb-4">
                      <img src={user.avatar} alt={user.displayName} className={`${isFirst ? 'w-32 h-32' : 'w-24 h-24'} rounded-full border-4 ${style.border}`} />
                      <div className={`absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br ${isFirst ? 'from-amber-500 to-amber-600' : 'from-ink-800 to-ink-900'} rounded-full flex items-center justify-center neon-border-blue`}>
                        <Icon className={`w-6 h-6 ${isFirst ? 'text-cream' : style.text}`} />
                      </div>
                    </div>
                    <div className={`text-6xl font-black ${style.text} mb-2 text-glow-blue`}>
                      #{user.rank}
                    </div>
                    <h3 className={`${isFirst ? 'text-3xl' : 'text-2xl'} font-bold mb-2 text-cream`}>
                      {user.displayName}
                    </h3>
                    <p className="text-cream-muted mb-4">@{user.username}</p>
                    <div className="flex items-center justify-center gap-6 mb-4">
                      <div>
                        <div className="text-2xl font-bold text-blue-400">{user.level}</div>
                        <div className="text-xs text-cream-muted">المستوى</div>
                      </div>
                      <div className="w-px h-10 bg-neon-blue/20" />
                      <div>
                        <div className="text-2xl font-bold text-red-400">{user.xp.toLocaleString()}</div>
                        <div className="text-xs text-cream-muted">إجمالي XP</div>
                      </div>
                      <div className="w-px h-10 bg-neon-blue/20" />
                      <div>
                        <div className="text-2xl font-bold text-amber-400">{parseInt(user.id) * 3 + 5}</div>
                        <div className="text-xs text-cream-muted">الأوسمة</div>
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
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-cream">
              <Trophy className="w-6 h-6 text-amber-400" />
              الترتيب الكامل
            </h2>
            <div className="space-y-3">
              {restOfLeaders.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="flex items-center gap-4 p-4 surface rounded-xl surface-hover transition-colors"
                >
                  <div className="w-12 text-center">
                    <span className="text-2xl font-bold text-cream-muted">#{user.rank}</span>
                  </div>
                  <img src={user.avatar} alt={user.displayName} className="w-14 h-14 rounded-full border-2 border-neon-blue/30" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-cream">{user.displayName}</h3>
                    <p className="text-sm text-cream-muted">@{user.username}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-cream">المستوى {user.level}</span>
                    </div>
                    <div className="text-sm text-cream-muted">{user.xp.toLocaleString()} XP</div>
                  </div>
                  <Badge variant="info" size="sm">لاعب مميز</Badge>
                </motion.div>
              ))}
            </div>
          </div>
        </GamingCard>
      </motion.div>
    </PageContainer>
  );
}
