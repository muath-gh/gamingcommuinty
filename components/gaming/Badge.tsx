'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  glow = false,
  className,
}: BadgeProps) {
  const variants = {
    default: 'bg-ink-800/70 text-cream-muted border-neon-cyan/20',
    success: 'bg-success/12 text-success border-success/40',
    warning: 'bg-amber-500/12 text-amber-300 border-amber-500/40',
    danger: 'bg-neon-crimson/12 text-neon-crimson-bright border-neon-crimson/40',
    info: 'bg-neon-cyan/12 text-neon-cyan-bright border-neon-cyan/40',
    amber: 'bg-neon-amber/12 text-neon-amber-bright border-neon-amber/40',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const glowClass = {
    info: 'shadow-[0_0_12px_rgba(20,184,196,0.4)]',
    danger: 'shadow-[0_0_12px_rgba(220,38,58,0.4)]',
    success: 'shadow-[0_0_12px_rgba(52,211,153,0.4)]',
    warning: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    amber: 'shadow-[0_0_12px_rgba(245,158,11,0.4)]',
    default: '',
  }[variant];

  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 420, damping: 20 }}
      className={cn(
        'inline-flex items-center gap-1.5 font-bold rounded-md border backdrop-blur-sm transition-colors',
        variants[variant],
        sizes[size],
        glow && glowClass,
        className,
      )}
    >
      {children}
    </motion.span>
  );
}
