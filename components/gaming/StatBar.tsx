'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatBarProps {
  value: number;
  max?: number;
  color?: 'cyan' | 'green' | 'red' | 'yellow' | 'blue' | 'amber' | 'crimson';
  className?: string;
}

export function StatBar({ value, max = 100, color = 'cyan', className }: StatBarProps) {
  const colorMap: Record<string, string> = {
    cyan: 'from-neon-cyan to-neon-cyan-bright',
    blue: 'from-neon-cyan to-neon-cyan-bright',
    green: 'from-emerald-600 to-emerald-400',
    red: 'from-neon-crimson to-neon-crimson-bright',
    crimson: 'from-neon-crimson to-neon-crimson-bright',
    yellow: 'from-neon-amber to-neon-amber-bright',
    amber: 'from-neon-amber to-neon-amber-bright',
  };
  const glowMap: Record<string, string> = {
    cyan: 'shadow-[0_0_10px_rgba(20,184,196,0.5)]',
    blue: 'shadow-[0_0_10px_rgba(20,184,196,0.5)]',
    green: 'shadow-[0_0_10px_rgba(52,211,153,0.5)]',
    red: 'shadow-[0_0_10px_rgba(220,38,58,0.5)]',
    crimson: 'shadow-[0_0_10px_rgba(220,38,58,0.5)]',
    yellow: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    amber: 'shadow-[0_0_10px_rgba(245,158,11,0.5)]',
  };
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('w-full h-2 bg-ink-925 rounded-full overflow-hidden border border-neon-cyan/10', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={cn('h-full rounded-full bg-gradient-to-r', colorMap[color] ?? colorMap.cyan, glowMap[color] ?? glowMap.cyan)}
      />
    </div>
  );
}
