'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Trophy, Zap, Star, Clock } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { StatBar } from '@/components/gaming/StatBar';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GlowText } from '@/components/gaming/GlowText';

const dailyQuests = [
  { id: '1', title: 'العب 3 مباريات', reward: 100, progress: 2, total: 3, icon: Target },
  { id: '2', title: 'افز في مباراة مصنفة', reward: 250, progress: 0, total: 1, icon: Trophy },
  { id: '3', title: 'انشر في المجتمع', reward: 50, progress: 1, total: 1, icon: Star },
];

const weeklyQuests = [
  { id: '4', title: 'افز 10 مباريات', reward: 500, progress: 6, total: 10, icon: Trophy },
  { id: '5', title: 'انضم لفريق', reward: 300, progress: 0, total: 1, icon: Target },
  { id: '6', title: 'ارفع 5 مقاطع', reward: 200, progress: 3, total: 5, icon: Zap },
];

export default function QuestsPage() {
  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-5xl font-bold mb-4 gradient-text">المهام اليومية</h1>
        <p className="text-xl text-cream-muted">أكمل المهام لكسب XP والمكافآت</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GamingCard glow className="p-6 text-center">
          <Zap className="w-12 h-12 text-amber-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-cream mb-1">850</div>
          <div className="text-sm text-cream-muted">XP اليوم</div>
        </GamingCard>
        <GamingCard glow className="p-6 text-center">
          <Trophy className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-cream mb-1">5/8</div>
          <div className="text-sm text-cream-muted">مهام مكتملة</div>
        </GamingCard>
        <GamingCard glow className="p-6 text-center">
          <Clock className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <div className="text-3xl font-bold text-cream mb-1">5س 23د</div>
          <div className="text-sm text-cream-muted">إعادة التعيين</div>
        </GamingCard>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cream mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400" />
          المهام اليومية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailyQuests.map((quest) => {
            const Icon = quest.icon;
            const isComplete = quest.progress >= quest.total;
            return (
              <GamingCard key={quest.id} hover glow={isComplete}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${isComplete ? 'text-emerald-400' : 'text-blue-400'}`} />
                    {isComplete && <Badge variant="success" size="sm">مكتمل</Badge>}
                  </div>
                  <h3 className="text-lg font-bold text-cream mb-2">{quest.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <span className="text-sm font-bold text-amber-400">{quest.reward} XP</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cream-muted">التقدم</span>
                      <span className="font-bold text-cream">{quest.progress}/{quest.total}</span>
                    </div>
                    <StatBar value={(quest.progress / quest.total) * 100} color={isComplete ? 'green' : 'blue'} />
                  </div>
                  {isComplete && <GamingButton className="w-full mt-2" variant="success">استلام المكافأة</GamingButton>}
                </div>
              </GamingCard>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-cream mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-400" />
          المهام الأسبوعية
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {weeklyQuests.map((quest) => {
            const Icon = quest.icon;
            const isComplete = quest.progress >= quest.total;
            return (
              <GamingCard key={quest.id} hover glow={isComplete}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${isComplete ? 'text-emerald-400' : 'text-red-400'}`} />
                    {isComplete && <Badge variant="success" size="sm">مكتمل</Badge>}
                  </div>
                  <h3 className="text-lg font-bold text-cream mb-2">{quest.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
                    <span className="text-sm font-bold text-amber-400">{quest.reward} XP</span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cream-muted">التقدم</span>
                      <span className="font-bold text-cream">{quest.progress}/{quest.total}</span>
                    </div>
                    <StatBar value={(quest.progress / quest.total) * 100} color={isComplete ? 'green' : 'red'} />
                  </div>
                  {isComplete && <GamingButton className="w-full mt-2" variant="success">استلام المكافأة</GamingButton>}
                </div>
              </GamingCard>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
