'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'md', glow = false, className }: BadgeProps) {
  const variants = {
    default: 'bg-ink-800/60 text-cream-muted border-neon-blue/20',
    success: 'bg-emerald-600/15 text-emerald-400 border-emerald-500/40',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
    danger: 'bg-neon-red/15 text-red-400 border-neon-red/40',
    info: 'bg-neon-blue/15 text-blue-400 border-neon-blue/40',
  };
  const sizes = { sm: 'px-2.5 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base' };
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={cn(
        'inline-flex items-center font-semibold rounded-full border backdrop-blur-sm transition-colors',
        variants[variant],
        sizes[size],
        glow && variant === 'info' && 'shadow-[0_0_12px_rgba(32,88,154,0.4)]',
        glow && variant === 'danger' && 'shadow-[0_0_12px_rgba(154,24,38,0.4)]',
        glow && variant === 'success' && 'shadow-[0_0_12px_rgba(16,185,129,0.4)]',
        glow && variant === 'warning' && 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
        className
      )}
    >
      {children}
    </motion.span>
  );
}
