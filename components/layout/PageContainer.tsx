'use client';
import React from 'react';
import { motion } from 'framer-motion';

interface PageContainerProps {
  children: React.ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen ambient-bg text-cream p-4 sm:p-6 md:p-8"
    >
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
