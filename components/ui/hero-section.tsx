'use client';

import { motion } from 'framer-motion';
import { Shield, Users, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../lib/providers/AuthProvider';
import { GamingButton } from '@/components/gaming/GamingButton';
import { PlayerAvatar } from '@/components/gaming/PlayerAvatar';

export default function HeroAuthSection() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  if (loading) {
    return (
      <motion.div
        className="flex gap-6 justify-center flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="px-8 py-4 rounded-xl surface">
          <div className="h-6 w-40 skeleton-shimmer rounded" />
        </div>
      </motion.div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <motion.div
        className="flex gap-4 justify-center flex-wrap items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative group"
        >
          <div className="relative glass-strong rounded-2xl px-6 py-3 flex items-center gap-4 neon-border-cyan">
            <PlayerAvatar name={user.name} src={user.avatar ?? undefined} size="md" rank="platinum" showStatus online />
            <div>
              <p className="text-xs text-cream-muted">أهلاً بك</p>
              <p className="text-base font-bold text-cream">{user.name}</p>
            </div>
          </div>
        </motion.div>

        <Link href="/discovery">
          <GamingButton variant="primary" size="lg" glow>
            <Users className="w-5 h-5" />
            ابحث عن لاعبين الآن
          </GamingButton>
        </Link>

        <GamingButton variant="ghost" size="lg" onClick={logout}>
          <LogOut className="w-5 h-5" />
          تسجيل الخروج
        </GamingButton>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="flex gap-4 justify-center flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    >
      <Link href="/auth">
        <GamingButton variant="primary" size="lg" glow>
          <Shield className="w-5 h-5" />
          تسجيل الدخول / إنشاء حساب
        </GamingButton>
      </Link>

      <Link href="/discovery">
        <GamingButton variant="ghost" size="lg">
          <Users className="w-5 h-5" />
          ابحث عن لاعبين الآن
        </GamingButton>
      </Link>
    </motion.div>
  );
}
