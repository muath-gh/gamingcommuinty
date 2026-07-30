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

export function GamingButton({
  variant = 'primary',
  size = 'md',
  glow = false,
  className,
  children,
  disabled,
  ...props
}: GamingButtonProps) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-secondary',
    ghost: 'btn-ghost',
    danger:
      'bg-gradient-to-br from-neon-crimson to-neon-crimson-deep text-white border border-neon-crimson/60 hover:shadow-glow-crimson',
    success:
      'bg-gradient-to-br from-success to-emerald-700 text-white border border-success/60 hover:shadow-[0_0_18px_rgba(52,211,153,0.4)]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl',
  };

  const MotionButton = motion.button as any;

  return (
    <MotionButton
      whileHover={disabled ? {} : { scale: 1.04, y: -1 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      disabled={disabled}
      className={cn(
        'relative font-extrabold tracking-tight transition-all duration-200 select-none',
        variants[variant],
        sizes[size],
        glow && variant === 'primary' && 'shadow-glow-cyan',
        glow && variant === 'secondary' && 'shadow-glow-amber',
        glow && variant === 'danger' && 'shadow-glow-crimson',
        disabled &&
          'opacity-45 grayscale-[40%] cursor-not-allowed pointer-events-none',
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </MotionButton>
  );
}
