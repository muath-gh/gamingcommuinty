'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PlayerAvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rank?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  online?: boolean;
  showStatus?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
};

const rankRing = {
  bronze: 'ring-amber-700/60',
  silver: 'ring-slate-400/60',
  gold: 'ring-neon-amber/70',
  platinum: 'ring-neon-cyan/70',
  diamond: 'ring-neon-cyan-bright shadow-[0_0_14px_rgba(20,184,196,0.5)]',
};

export function PlayerAvatar({
  name,
  src,
  size = 'md',
  rank,
  online,
  showStatus = false,
  className,
}: PlayerAvatarProps) {
  const initial = name?.charAt(0) || '?';

  return (
    <div className={cn('relative flex-shrink-0', className)}>
      <div
        className={cn(
          'relative rounded-full flex items-center justify-center font-bold text-cream overflow-hidden',
          'bg-gradient-to-br from-neon-cyan to-neon-cyan-deep',
          sizeMap[size],
          rank && `ring-2 ${rankRing[rank]}`,
        )}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="font-display">{initial}</span>
        )}
      </div>
      {showStatus && (
        <span
          className={cn(
            'absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full border-2 border-ink-950',
            online ? 'bg-success animate-presence' : 'bg-cream-dim',
          )}
        />
      )}
    </div>
  );
}
