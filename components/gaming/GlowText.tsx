'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface GlowTextProps {
  children: React.ReactNode;
  color?: 'cyan' | 'amber' | 'crimson' | 'purple' | 'pink' | 'blue' | 'green' | 'red' | 'yellow';
  className?: string;
  animate?: boolean;
}

export function GlowText({ children, color = 'cyan', className }: GlowTextProps) {
  // Map legacy color names onto the cohesive cyan/amber/crimson palette.
  const colors: Record<string, string> = {
    cyan: 'text-neon-cyan-bright text-glow-cyan',
    blue: 'text-neon-cyan-bright text-glow-cyan',
    green: 'text-success text-glow-cyan',
    yellow: 'text-neon-amber-bright text-glow-amber',
    amber: 'text-neon-amber-bright text-glow-amber',
    crimson: 'text-neon-crimson-bright text-glow-crimson',
    red: 'text-neon-crimson-bright text-glow-crimson',
    pink: 'text-neon-crimson-bright text-glow-crimson',
    purple: 'text-neon-cyan-bright text-glow-cyan',
  };
  return (
    <span className={cn('font-display font-extrabold', colors[color] ?? colors.cyan, className)}>
      {children}
    </span>
  );
}
