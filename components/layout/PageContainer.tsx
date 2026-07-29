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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="min-h-screen ambient-bg text-cream p-6 md:p-8"
    >
      {children}
    </motion.div>
  );
}
