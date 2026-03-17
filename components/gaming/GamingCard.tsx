'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamingCardProps {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  className?: string;
}

export function GamingCard({ children, hover = false, glow = false, gradient = false, className }: GamingCardProps) {
  const Component = hover ? motion.div : 'div';
  return (
    <Component
      {...(hover ? { whileHover: { y: -5, scale: 1.02 } } : {})}
      className={cn(
        'rounded-xl border border-slate-800 overflow-hidden transition-all',
        gradient ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-slate-900/50',
        glow && 'shadow-lg shadow-blue-500/10',
        className
      )}
    >
      {children}
    </Component>
  );
}
