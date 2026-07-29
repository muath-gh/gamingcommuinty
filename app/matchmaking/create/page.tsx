'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Mic } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GlowText } from '@/components/gaming/GlowText';
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
    alert('Matchmaking post created! (This is a demo)');
  };

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <Link href="/matchmaking">
          <GamingButton variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Matchmaking
          </GamingButton>
        </Link>

        <div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Create Matchmaking Post</h1>
          <p className="text-xl text-cream-muted">Find the perfect teammates or rivals</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <GamingCard>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-cream">
                  Game <span className="text-red-400">*</span>
                </label>
                <select
                  required
                  value={formData.gameId}
                  onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                  className="w-full input-gaming rounded-lg px-4 py-3"
                >
                  <option value="">Select a game</option>
                  {mockGames.map(game => (
                    <option key={game.id} value={game.id}>{game.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-cream">
                  Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {(['teammate', 'rival', 'casual'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, type })}
                      className={`p-4 rounded-lg font-medium transition-all capitalize ${
                        formData.type === type
                          ? 'btn-primary glow-blue'
                          : 'btn-ghost'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-cream">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Looking for ranked squad - Diamond+"
                  className="w-full input-gaming rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-cream">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what you're looking for..."
                  rows={4}
                  className="w-full input-gaming rounded-lg px-4 py-3 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 text-cream">
                    Skill Level <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.skillLevel}
                    onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                    className="w-full input-gaming rounded-lg px-4 py-3"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                    <option>Pro</option>
                    <option>Elite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-cream">
                    Spots Available <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.spotsAvailable}
                    onChange={(e) => setFormData({ ...formData, spotsAvailable: parseInt(e.target.value) })}
                    className="w-full input-gaming rounded-lg px-4 py-3"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-cream">
                  Availability <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  placeholder="e.g., Evenings EST, Weekends"
                  className="w-full input-gaming rounded-lg px-4 py-3"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="voiceRequired"
                  checked={formData.voiceRequired}
                  onChange={(e) => setFormData({ ...formData, voiceRequired: e.target.checked })}
                  className="w-5 h-5 rounded accent-neon-blue"
                />
                <label htmlFor="voiceRequired" className="font-semibold flex items-center gap-2 text-cream">
                  <Mic className="w-5 h-5 text-emerald-400" />
                  Voice chat required
                </label>
              </div>
            </div>
          </GamingCard>

          <div className="flex gap-4">
            <GamingButton type="submit" size="lg" glow className="flex-1">
              <Users className="w-5 h-5 mr-2" />
              Create Post
            </GamingButton>
            <Link href="/matchmaking" className="flex-1">
              <GamingButton type="button" variant="ghost" size="lg" className="w-full">
                Cancel
              </GamingButton>
            </Link>
          </div>
        </form>
      </motion.div>
    </PageContainer>
  );
}
