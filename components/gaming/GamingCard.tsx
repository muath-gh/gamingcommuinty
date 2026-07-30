'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GamingCardProps {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  accent?: 'cyan' | 'amber' | 'crimson' | 'none';
  className?: string;
}

export function GamingCard({
  children,
  hover = false,
  glow = false,
  gradient = false,
  accent = 'cyan',
  className,
}: GamingCardProps) {
  const Component = hover ? motion.div : 'div';

  const accentBorder = {
    cyan: 'hover:border-neon-cyan/45',
    amber: 'hover:border-neon-amber/45',
    crimson: 'hover:border-neon-crimson/45',
    none: '',
  }[accent];

  const accentGlow = {
    cyan: 'shadow-card-hover',
    amber: 'shadow-[0_0_18px_rgba(245,158,11,0.18),0_18px_40px_-18px_rgba(245,158,11,0.3)]',
    crimson: 'shadow-[0_0_18px_rgba(220,38,58,0.18),0_18px_40px_-18px_rgba(220,38,58,0.3)]',
    none: '',
  }[accent];

  return (
    <Component
      dir="rtl"
      {...(hover ? { whileHover: { y: -6, scale: 1.015 }, transition: { type: 'spring', stiffness: 380, damping: 28 } } : {})}
      className={cn(
        'relative rounded-xl surface surface-hover overflow-hidden',
        gradient && 'bg-gradient-to-br from-ink-850/90 to-ink-950',
        glow && accentGlow,
        accentBorder,
        className,
      )}
    >
      {children}
    </Component>
  );
}
