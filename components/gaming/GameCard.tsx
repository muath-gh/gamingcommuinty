'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star } from 'lucide-react';
import { Badge } from './Badge';
import { cn } from '@/lib/utils';

interface GameCardProps {
  title: string;
  coverImage: string;
  rating: number;
  playerCount: string;
  trending?: boolean;
  onClick?: () => void;
}

export function GameCard({ title, coverImage, rating, playerCount, trending, onClick }: GameCardProps) {
  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} className="group cursor-pointer" onClick={onClick}>
      <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50">
        <div className="relative h-64 overflow-hidden">
          <img src={coverImage} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          {trending && (
            <div className="absolute top-4 right-4">
              <Badge variant="danger" glow>Trending</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4" fill="currentColor" />
              <span className="font-bold">{rating}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Users className="w-4 h-4" />
              <span>{playerCount}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
