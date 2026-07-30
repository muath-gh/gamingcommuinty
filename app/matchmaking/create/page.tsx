'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Mic, Gamepad2, Swords, Target, Handshake } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GlowText } from '@/components/gaming/GlowText';
import { Badge } from '@/components/gaming/Badge';
import { mockGames } from '@/lib/mockData';

export default function CreateMatchmakingPage() {
  const [formData, setFormData] = useState({
    gameId: '',
    title: '',
    description: '',
    type: 'teammate' as 'teammate' | 'rival' | 'casual',
    platforms: [] as string[],
    regions: [] as string[],
    languages: [] as string[],
    skillLevel: 'Intermediate',
    voiceRequired: false,
    spotsAvailable: 1,
    availability: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('تم إنشاء طلب اللعب! (هذه نسخة تجريبية)');
  };

  const typeOptions = [
    { value: 'teammate' as const, label: 'زميل فريق', icon: Users, accent: 'cyan' as const },
    { value: 'rival' as const, label: 'منافس', icon: Swords, accent: 'crimson' as const },
    { value: 'casual' as const, label: 'لعب حر', icon: Handshake, accent: 'amber' as const },
  ];

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <Link href="/discovery">
          <motion.div whileHover={{ x: -4 }} whileTap={{ scale: 0.97 }}>
            <GamingButton variant="ghost" size="sm">
              <ArrowRight className="w-4 h-4" />
              العودة للاكتشاف
            </GamingButton>
          </motion.div>
        </Link>

        <div>
          <Badge variant="info" glow className="mb-4 inline-flex">
            <Target className="w-4 h-4" />
            طلب لعب جديد
          </Badge>
          <h1 className="font-display text-4xl sm:text-5xl font-black mb-3">
            أنشئ <GlowText color="cyan">طلب لعب</GlowText>
          </h1>
          <p className="text-lg text-cream-muted">اعثر على الزملاء أو المنافسين المثاليين</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <GamingCard glow accent="cyan" className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Game */}
              <div>
                <label className="block text-sm font-bold mb-2 text-cream">
                  اللعبة <span className="text-neon-crimson-bright">*</span>
                </label>
                <select
                  required
                  value={formData.gameId}
                  onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                  className="input-gaming w-full rounded-lg px-4 py-3 text-right"
                  dir="rtl"
                >
                  <option value="">اختر لعبة</option>
                  {mockGames.map(game => (
                    <option key={game.id} value={game.id}>{game.title}</option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-bold mb-2 text-cream">
                  النوع <span className="text-neon-crimson-bright">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  {typeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, type: opt.value })}
                      className={`p-4 rounded-xl font-bold transition-all flex flex-col items-center gap-2 ${
                        formData.type === opt.value
                          ? 'btn-primary glow-cyan'
                          : 'btn-ghost'
                      }`}
                    >
                      <opt.icon className="w-5 h-5" />
                      <span className="text-sm">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold mb-2 text-cream">
                  العنوان <span className="text-neon-crimson-bright">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: أبحث عن فرقة رانكد - دياموند فما فوق"
                  className="input-gaming w-full rounded-lg px-4 py-3 text-right"
                  dir="rtl"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold mb-2 text-cream">
                  الوصف <span className="text-neon-crimson-bright">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="صف ما تبحث عنه..."
                  rows={4}
                  className="input-gaming w-full rounded-lg px-4 py-3 resize-none text-right"
                  dir="rtl"
                />
              </div>

              {/* Skill + Spots */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold mb-2 text-cream">
                    مستوى المهارة <span className="text-neon-crimson-bright">*</span>
                  </label>
                  <select
                    required
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as any })}
                    className="input-gaming w-full rounded-lg px-4 py-3 text-right"
                    dir="rtl"
                  >
                    <option>مبتدئ</option>
                    <option>متوسط</option>
                    <option>متقدم</option>
                    <option>محترف</option>
                    <option>نخبة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 text-cream">
                    الأماكن المتاحة <span className="text-neon-crimson-bright">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.spotsAvailable}
                    onChange={(e) => setFormData({ ...formData, spotsAvailable: parseInt(e.target.value) })}
                    className="input-gaming w-full rounded-lg px-4 py-3 text-right"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-bold mb-2 text-cream">
                  أوقات التواجد <span className="text-neon-crimson-bright">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  placeholder="مثال: المساء، عطلات نهاية الأسبوع"
                  className="input-gaming w-full rounded-lg px-4 py-3 text-right"
                  dir="rtl"
                />
              </div>

              {/* Voice */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-ink-925/50 border border-neon-cyan/10">
                <input
                  type="checkbox"
                  id="voiceRequired"
                  checked={formData.voiceRequired}
                  onChange={(e) => setFormData({ ...formData, voiceRequired: e.target.checked })}
                  className="w-5 h-5 rounded accent-neon-cyan-bright"
                />
                <label htmlFor="voiceRequired" className="font-bold flex items-center gap-2 text-cream cursor-pointer">
                  <Mic className="w-5 h-5 text-success" />
                  مطلوب دردشة صوتية
                </label>
              </div>
            </div>
          </GamingCard>

          <div className="flex flex-col sm:flex-row gap-4">
            <GamingButton type="submit" size="lg" glow className="flex-1">
              <Users className="w-5 h-5" />
              أنشئ الطلب
            </GamingButton>
            <Link href="/discovery" className="flex-1">
              <GamingButton type="button" variant="ghost" size="lg" className="w-full">
                إلغاء
              </GamingButton>
            </Link>
          </div>
        </form>
      </motion.div>
    </PageContainer>
  );
}
