"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GamingCardProps {
  children: React.ReactNode;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
  className?: string;
}

export function GamingCard({
  children,
  hover = false,
  glow = false,
  gradient = false,
  className,
}: GamingCardProps) {
  const Component = hover ? motion.div : "div";
  return (
    <Component
<<<<<<< HEAD
      dir="rtl"
      {...(hover ? { whileHover: { y: -5, scale: 1.02 } } : {})}
      className={cn(
        "rounded-xl border border-slate-800 overflow-hidden transition-all",
        gradient
          ? "bg-gradient-to-br from-slate-900 to-slate-800"
          : "bg-slate-900/50",
        glow && "shadow-lg shadow-blue-500/10",
        className,
=======
      {...(hover ? { whileHover: { y: -4, scale: 1.01 } } : {})}
      className={cn(
        'relative rounded-xl overflow-hidden transition-all duration-300',
        gradient
          ? 'bg-gradient-to-br from-ink-800/60 to-ink-950/80 border border-neon-blue/20'
          : 'surface',
        glow && 'glow-soft-blue',
        hover && 'surface-hover',
        className
>>>>>>> e42140751903e0eb5f1b4d6554d1f1b43c2657e2
      )}
    >
      {children}
    </Component>
  );
}
