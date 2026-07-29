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
      {...(hover ? { whileHover: { y: -4, scale: 1.01 } } : {})}
      className={cn(
        'relative rounded-xl overflow-hidden transition-all duration-300',
        gradient
          ? 'bg-gradient-to-br from-ink-800/60 to-ink-950/80 border border-neon-blue/20'
          : 'surface',
        glow && 'glow-soft-blue',
        hover && 'surface-hover',
        className
      )}
    >
      {children}
    </Component>
  );
}
