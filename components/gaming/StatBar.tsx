'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'red' | 'yellow';
  className?: string;
}

export function StatBar({ value, max = 100, color = 'blue', className }: StatBarProps) {
  const colors = {
    blue: 'bg-gradient-to-r from-neon-blue to-blue-400',
    green: 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    red: 'bg-gradient-to-r from-neon-red to-red-400',
    yellow: 'bg-gradient-to-r from-amber-500 to-amber-300',
  };
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('w-full h-2 bg-ink-900/80 rounded-full overflow-hidden border border-neon-blue/10', className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={cn('h-full rounded-full', colors[color])}
      />
    </div>
  );
}
