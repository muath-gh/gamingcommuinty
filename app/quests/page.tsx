'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Zap, Star, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { StatBar } from '@/components/gaming/StatBar';
import { GamingButton } from '@/components/gaming/GamingButton';

const dailyQuests = [
  { id: '1', title: 'Play 3 Matches', reward: 100, progress: 2, total: 3, icon: Target },
  { id: '2', title: 'Win a Ranked Game', reward: 250, progress: 0, total: 1, icon: Trophy },
  { id: '3', title: 'Post in Community', reward: 50, progress: 1, total: 1, icon: Star },
];

const weeklyQuests = [
  { id: '4', title: 'Win 10 Matches', reward: 500, progress: 6, total: 10, icon: Trophy },
  { id: '5', title: 'Join a Team', reward: 300, progress: 0, total: 1, icon: Target },
  { id: '6', title: 'Upload 5 Clips', reward: 200, progress: 3, total: 5, icon: Zap },
];

export default function QuestsPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 gradient-text">Daily Quests</h1>
        <p className="text-xl text-slate-400">Complete quests to earn XP and rewards</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GamingCard glow className="p-6 text-center">
          <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">850</div>
          <div className="text-sm text-slate-400">XP Today</div>
        </GamingCard>
        <GamingCard glow className="p-6 text-center">
          <Trophy className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">5/8</div>
          <div className="text-sm text-slate-400">Quests Complete</div>
        </GamingCard>
        <GamingCard glow className="p-6 text-center">
          <Clock className="w-12 h-12 text-purple-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-white mb-1">5h 23m</div>
          <div className="text-sm text-slate-400">Daily Reset</div>
        </GamingCard>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">Daily Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailyQuests.map((quest) => {
            const Icon = quest.icon;
            const isComplete = quest.progress >= quest.total;
            return (
              <GamingCard key={quest.id} hover glow={isComplete}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${isComplete ? 'text-green-400' : 'text-blue-400'}`} />
                    {isComplete && <Badge variant="success" size="sm">Complete</Badge>}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{quest.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-400">{quest.reward} XP</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-bold text-white">{quest.progress}/{quest.total}</span>
                    </div>
                    <StatBar value={(quest.progress / quest.total) * 100} color={isComplete ? 'green' : 'blue'} />
                  </div>
                  {isComplete && <GamingButton className="w-full mt-2" variant="success">Claim Reward</GamingButton>}
                </div>
              </GamingCard>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Weekly Quests</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weeklyQuests.map((quest) => {
            const Icon = quest.icon;
            const isComplete = quest.progress >= quest.total;
            return (
              <GamingCard key={quest.id} hover glow={isComplete}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${isComplete ? 'text-green-400' : 'text-purple-400'}`} />
                    {isComplete && <Badge variant="success" size="sm">Complete</Badge>}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{quest.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-yellow-400">{quest.reward} XP</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Progress</span>
                      <span className="font-bold text-white">{quest.progress}/{quest.total}</span>
                    </div>
                    <StatBar value={(quest.progress / quest.total) * 100} color={isComplete ? 'green' : 'purple'} />
                  </div>
                  {isComplete && <GamingButton className="w-full mt-2" variant="success">Claim Reward</GamingButton>}
                </div>
              </GamingCard>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
