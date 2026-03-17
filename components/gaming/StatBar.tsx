'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatBarProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  className?: string;
}

export function StatBar({ value, max = 100, color = 'blue', className }: StatBarProps) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
  };
  const percentage = Math.min((value / max) * 100, 100);
  return (
    <div className={cn('w-full h-2 bg-slate-800 rounded-full overflow-hidden', className)}>
      <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.5 }} className={cn('h-full rounded-full', colors[color])} />
    </div>
  );
}
