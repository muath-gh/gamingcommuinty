'use client';

import { motion } from 'framer-motion';
import { Shield, Users, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../lib/providers/AuthProvider';
import { GamingButton } from '@/components/gaming/GamingButton';

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
          <div className="relative glass-strong rounded-2xl px-6 py-3 flex items-center gap-4 neon-border-blue">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue to-neon-red rounded-full blur-md opacity-40" />
              <div className="relative w-11 h-11 bg-gradient-to-br from-neon-blue to-neon-red-deep rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-5 h-5 text-cream" />
                )}
              </div>
            </div>

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
