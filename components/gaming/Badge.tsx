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
    default: 'bg-slate-700 text-slate-200',
    success: 'bg-green-600/20 text-green-400 border-green-500/50',
    warning: 'bg-yellow-600/20 text-yellow-400 border-yellow-500/50',
    danger: 'bg-red-600/20 text-red-400 border-red-500/50',
    info: 'bg-blue-600/20 text-blue-400 border-blue-500/50',
  };
  const sizes = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-base' };
  return <motion.span whileHover={{ scale: 1.05 }} className={cn('inline-flex items-center font-semibold rounded-full border', variants[variant], sizes[size], glow && 'shadow-lg shadow-current/50', className)}>{children}</motion.span>;
}
