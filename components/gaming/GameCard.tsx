'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Star, Flame } from 'lucide-react';
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
    <motion.div
      whileHover={{ y: -8, scale: 1.025 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-xl surface surface-hover">
        <div className="relative h-64 overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/0 group-hover:from-neon-cyan/10 group-hover:to-transparent transition-all duration-500" />
          {trending && (
            <div className="absolute top-3 right-3">
              <Badge variant="danger" glow size="sm">
                <Flame className="w-3 h-3" />
                رائج
              </Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-display font-bold text-cream mb-3 truncate">{title}</h3>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1.5 text-neon-amber-bright">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">{rating}</span>
            </div>
            <div className="flex items-center gap-1.5 text-cream-muted">
              <Users className="w-4 h-4" />
              <span>{playerCount}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
