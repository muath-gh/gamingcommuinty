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
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-primary',
    ghost: 'btn-ghost',
    danger: 'btn-secondary',
    success: 'bg-gradient-to-br from-emerald-600 to-green-700 text-white border border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all',
  };
  const sizes = { sm: 'px-4 py-2 text-sm rounded-lg', md: 'px-6 py-3 text-base rounded-xl', lg: 'px-8 py-4 text-lg rounded-xl' };
  const MotionButton = motion.button as any;
  return (
    <MotionButton
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative font-bold transition-all duration-250 inline-flex items-center justify-center gap-2 select-none',
        variants[variant],
        sizes[size],
        glow && variant === 'primary' && 'glow-blue',
        glow && variant === 'secondary' && 'glow-red',
        glow && variant === 'accent' && 'glow-blue',
        glow && variant === 'danger' && 'glow-red',
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </MotionButton>
  );
}
