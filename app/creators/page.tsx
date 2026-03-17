'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Users, Eye, TrendingUp, Play, CheckCircle2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { mockUsers } from '@/lib/mockData';

export default function CreatorsPage() {
  const [filterType, setFilterType] = useState<'all' | 'streaming' | 'video' | 'educational'>('all');

  const creators = mockUsers.filter(user => user.isCreator);

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div>
          <h1 className="text-5xl font-bold mb-4 gradient-text">Creator Program</h1>
          <p className="text-xl text-slate-400">Discover amazing gaming content creators</p>
        </div>

        <GamingCard gradient glow className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold mb-4">Become a Creator</h2>
              <p className="text-slate-300 mb-6">
                Join our creator program to get exclusive benefits, verified badge, partnership opportunities, and monetization options.
              </p>
              <GamingButton size="lg" glow>Apply Now</GamingButton>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">500+</div>
                <div className="text-sm text-slate-400">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">10M+</div>
                <div className="text-sm text-slate-400">Monthly Views</div>
              </div>
            </div>
          </div>
        </GamingCard>

        <div className="flex gap-3 flex-wrap">
          {['all', 'streaming', 'video', 'educational'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all capitalize ${
                filterType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => (
            <motion.div
              key={creator.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/creators/${creator.username}`}>
                <GamingCard hover glow>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={creator.avatar}
                      alt={creator.displayName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                    {creator.isVerified && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="warning" glow>
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={creator.avatar}
                        alt={creator.displayName}
                        className="w-16 h-16 rounded-full border-2 border-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-bold">{creator.displayName}</h3>
                        <p className="text-sm text-slate-400">@{creator.username}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">
                      {creator.bio}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center text-sm">
                      <div>
                        <div className="font-bold text-blue-400">
                          {(parseInt(creator.id) * 5420).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Followers</div>
                      </div>
                      <div>
                        <div className="font-bold text-purple-400">
                          {parseInt(creator.id) * 23}
                        </div>
                        <div className="text-xs text-slate-400">Videos</div>
                      </div>
                      <div>
                        <div className="font-bold text-pink-400">
                          {(parseInt(creator.id) * 123000).toLocaleString()}
                        </div>
                        <div className="text-xs text-slate-400">Views</div>
                      </div>
                    </div>
                  </div>
                </GamingCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}
