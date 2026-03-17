'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  glow?: boolean;
  children: React.ReactNode;
}

export function GamingButton({ variant = 'primary', size = 'md', glow = false, className, children, ...props }: GamingButtonProps) {
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    accent: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    ghost: 'bg-transparent border-2 border-slate-600 hover:border-blue-500 text-slate-300 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
  };
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-6 py-3 text-base', lg: 'px-8 py-4 text-lg' };
  const MotionButton = motion.button as any;
  return (
    <MotionButton whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={cn('relative font-bold rounded-lg transition-all', variants[variant], sizes[size], glow && 'shadow-lg shadow-blue-500/50', className)} {...props}>
      <span className="relative z-10">{children}</span>
    </MotionButton>
  );
}
