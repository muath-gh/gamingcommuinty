'use client';
import React, { useState } from 'react';
import { Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { mockGames } from '@/lib/mockData';

export default function CreateReviewPage() {
  const [formData, setFormData] = useState({
    selectedGame: mockGames[0].id,
    rating: 8,
    title: '',
    review: '',
    gameplay: 8,
    graphics: 9,
    story: 7,
    sound: 8,
  });

  const selectedGame = mockGames.find((g) => g.id === formData.selectedGame);

  return (
    <PageContainer>
      <Link href="/reviews">
        <GamingButton variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Reviews
        </GamingButton>
      </Link>

      <h1 className="text-4xl font-bold mb-8 gradient-text">Write a Review</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <GamingCard className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Select Game</h2>
            <select value={formData.selectedGame} onChange={(e) => setFormData({ ...formData, selectedGame: e.target.value })} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white">
              {mockGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.title}
                </option>
              ))}
            </select>
          </GamingCard>

          <GamingCard className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Overall Rating</h2>
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                <Star key={star} className={`w-8 h-8 cursor-pointer transition-colors ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} onClick={() => setFormData({ ...formData, rating: star })} />
              ))}
              <span className="text-3xl font-bold text-blue-400 ml-4">{formData.rating}/10</span>
            </div>
          </GamingCard>

          <GamingCard className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Detailed Ratings</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Gameplay</span>
                  <span className="text-blue-400">{formData.gameplay}/10</span>
                </div>
                <input type="range" min="0" max="10" value={formData.gameplay} onChange={(e) => setFormData({ ...formData, gameplay: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Graphics</span>
                  <span className="text-blue-400">{formData.graphics}/10</span>
                </div>
                <input type="range" min="0" max="10" value={formData.graphics} onChange={(e) => setFormData({ ...formData, graphics: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Story</span>
                  <span className="text-blue-400">{formData.story}/10</span>
                </div>
                <input type="range" min="0" max="10" value={formData.story} onChange={(e) => setFormData({ ...formData, story: parseInt(e.target.value) })} className="w-full" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Sound</span>
                  <span className="text-blue-400">{formData.sound}/10</span>
                </div>
                <input type="range" min="0" max="10" value={formData.sound} onChange={(e) => setFormData({ ...formData, sound: parseInt(e.target.value) })} className="w-full" />
              </div>
            </div>
          </GamingCard>

          <GamingCard className="p-6">
            <h2 className="text-2xl font-bold mb-4">Your Review</h2>
            <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Review Title" className="w-full p-3 mb-4 bg-slate-800 border border-slate-700 rounded-lg text-white" />
            <textarea value={formData.review} onChange={(e) => setFormData({ ...formData, review: e.target.value })} placeholder="Write your detailed review here..." rows={10} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none" />
          </GamingCard>
        </div>

        <div>
          <GamingCard className="p-6 sticky top-6">
            <h3 className="text-xl font-bold mb-4">Preview</h3>
            {selectedGame && (
              <div className="mb-4">
                <img src={selectedGame.coverImage} alt={selectedGame.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                <h4 className="font-bold text-lg">{selectedGame.title}</h4>
              </div>
            )}
            <div className="mb-4">
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-5 h-5 text-yellow-400" fill="currentColor" />
                <span className="text-2xl font-bold text-yellow-400">{formData.rating}/10</span>
              </div>
            </div>
            <GamingButton variant="accent" glow className="w-full">
              Publish Review
            </GamingButton>
          </GamingCard>
        </div>
      </div>
    </PageContainer>
  );
}
