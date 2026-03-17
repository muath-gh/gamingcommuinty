'use client';

import { motion } from 'framer-motion';
import { Shield, Users, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth  } from '../../lib/providers/AuthProvider';
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
        <div className="px-8 py-4 rounded-xl bg-gray-800/50 animate-pulse">
          <div className="h-6 w-40 bg-gray-700/50 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <motion.div
        className="flex gap-6 justify-center flex-wrap items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800/50 rounded-2xl px-8 py-4 flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full blur-md opacity-50" />
              <div className="relative w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-400">أهلاً بك</p>
              <p className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                {user.name}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <Link href="/discovery">
          <GamingButton variant="accent" size="lg" glow>
            <Users className="w-5 h-5 ml-2" />
            ابحث عن لاعبين الآن
          </GamingButton>
        </Link>

        <GamingButton variant="ghost" size="lg" onClick={logout}>
          <LogOut className="w-5 h-5 ml-2" />
          تسجيل الخروج
        </GamingButton>
      </motion.div>
    );
  }

  // Guest
  return (
    <motion.div
      className="flex gap-6 justify-center flex-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.6 }}
    >
      <Link href="/auth">
        <GamingButton variant="accent" size="lg" glow>
          <Shield className="w-5 h-5 ml-2" />
          تسجيل الدخول / إنشاء حساب
        </GamingButton>
      </Link>

      <Link href="/discovery">
        <GamingButton variant="ghost" size="lg">
          <Users className="w-5 h-5 ml-2" />
          ابحث عن لاعبين الآن
        </GamingButton>
      </Link>
    </motion.div>
  );
}
