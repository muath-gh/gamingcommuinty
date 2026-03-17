'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlowTextProps {
  children: React.ReactNode;
  color?: 'blue' | 'purple' | 'pink';
  className?: string;
  animate?: boolean;
}

export function GlowText({ children, color = 'blue', className, animate = false }: GlowTextProps) {
  const colors = {
    blue: 'text-blue-400 [text-shadow:0_0_20px_rgba(59,130,246,0.8)]',
    purple: 'text-purple-400 [text-shadow:0_0_20px_rgba(168,85,247,0.8)]',
    pink: 'text-pink-400 [text-shadow:0_0_20px_rgba(236,72,153,0.8)]',
  };
  const Component = animate ? (motion.span as any) : 'span';
  return <Component className={cn('font-bold', colors[color], className)}>{children}</Component>;
}
