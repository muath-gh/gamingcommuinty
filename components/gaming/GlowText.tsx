'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface GlowTextProps {
  children: React.ReactNode;
  color?: 'blue' | 'red';
  className?: string;
  animate?: boolean;
}

export function GlowText({ children, color = 'blue', className }: GlowTextProps) {
  const colors = {
    blue: 'text-blue-400 text-glow-blue',
    red: 'text-red-400 text-glow-red',
  };
  return <span className={cn('font-bold', colors[color], className)}>{children}</span>;
}
