'use client';
import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { Users, Trophy, Gamepad2, MessageSquare, Image, Star, TrendingUp, Zap, Globe, Sparkles, Target, Shield, Swords, Newspaper, Edit3, Languages } from 'lucide-react';
import { GameCard } from '@/components/gaming/GameCard';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';
import { mockGames, getTrendingGames } from '@/lib/mockData';
import HeroAuthSection from '@/components/ui/hero-section';

const features = [
  {
    icon: Users,
    title: 'اعثر على لاعبين',
    description: 'تواصل مع اللاعبين حول العالم',
    color: 'from-cyan-500 to-blue-500',
    iconColor: 'text-cyan-400',
    href: '/discovery'
  },
  {
    icon: Languages,
    title: 'مركز التعريب',
    description: 'ألعاب معربة بالكامل للعربية',
    color: 'from-blue-500 to-cyan-500',
    iconColor: 'text-blue-400',
    href: '/localization'
  },
  {
    icon: Image,
    title: 'معرض الوسائط',
    description: 'صور وفيديوهات من المجتمع',
    color: 'from-pink-500 to-rose-500',
    iconColor: 'text-pink-400',
    href: '/gallery'
  },
  {
    icon: Edit3,
    title: 'مراجعات الألعاب',
    description: 'تقييمات شاملة لأحدث الألعاب',
    color: 'from-violet-500 to-fuchsia-500',
    iconColor: 'text-violet-400',
    href: '/reviews'
  },
  {
    icon: Newspaper,
    title: 'أخبار الألعاب',
    description: 'آخر الأخبار والمستجدات',
    color: 'from-orange-500 to-red-500',
    iconColor: 'text-orange-400',
    href: '/news'
  },
  {
    icon: Trophy,
    title: 'تنافس',
    description: 'تسلق قوائم المتصدرين',
    color: 'from-yellow-500 to-orange-500',
    iconColor: 'text-yellow-400',
    href: '/leaderboard'
  },
];

const stats = [
  { value: '+50 مليون', label: 'لاعب نشط', icon: Users, color: 'text-cyan-400' },
  { value: '+10 آلاف', label: 'فريق وعشيرة', icon: Shield, color: 'text-purple-400' },
  { value: '+500 ألف', label: 'مباراة يومية', icon: Swords, color: 'text-green-400' },
  { value: '+1 مليون', label: 'محتوى مرفوع', icon: Image, color: 'text-pink-400' },
];

export default function Home() {
  const trendingGames = getTrendingGames();
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 40%)`
        }}
      />

      <motion.div
        className="relative overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900" />
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress')] opacity-5 bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-32">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge variant="info" glow className="mb-8 inline-flex">
                <Sparkles className="w-4 h-4 ml-2" />
                انضم إلى +50 مليون لاعب حول العالم
              </Badge>
            </motion.div>

            <motion.h1
              className="text-7xl md:text-8xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              مركزك المثالي{' '}
              <span className="relative inline-block">
                <GlowText color="blue">للألعاب</GlowText>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-xl opacity-30"
                  animate={{
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              تواصل مع اللاعبين، وتصدر قوائم الترتيب، وابنِ إرثك في عالم الألعاب
            </motion.p>
            <HeroAuthSection />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, staggerChildren: 0.1 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link href={feature.href}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <GamingCard hover glow className="p-8 text-center cursor-pointer h-full relative overflow-hidden group">
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />
                    <motion.div
                      className="relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <feature.icon className={`w-14 h-14 ${feature.iconColor} mx-auto mb-4`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 relative">{feature.title}</h3>
                    <p className="text-sm text-slate-400 relative">{feature.description}</p>
                  </GamingCard>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mb-24"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              className="text-5xl font-black"
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              الألعاب <GlowText color="blue">الرائجة</GlowText>
            </motion.h2>
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/games">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GamingButton variant="ghost">
                    عرض الكل
                    <TrendingUp className="w-4 h-4 mr-2" />
                  </GamingButton>
                </motion.div>
              </Link>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <GameCard
                  title={game.title}
                  coverImage={game.coverImage}
                  rating={game.rating}
                  playerCount={game.playerCount}
                  trending={game.trending}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <GamingCard gradient className="p-10 h-full relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Zap className="w-16 h-16 text-yellow-400 mb-6" />
              </motion.div>
              <h3 className="text-3xl font-black mb-4">أكمل المهام اليومية</h3>
              <p className="text-slate-300 mb-8 text-lg">اكسب نقاط الخبرة وافتح المكافآت الحصرية من خلال إكمال التحديات اليومية والأسبوعية.</p>
              <Link href="/quests">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GamingButton variant="primary" glow>
                    <Target className="w-4 h-4 ml-2" />
                    عرض المهام
                  </GamingButton>
                </motion.div>
              </Link>
            </GamingCard>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <GamingCard gradient className="p-10 h-full relative overflow-hidden group">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <motion.div
                initial={{ scale: 0.8, rotate: 10 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <Trophy className="w-16 h-16 text-blue-400 mb-6" />
              </motion.div>
              <h3 className="text-3xl font-black mb-4">تسلق قائمة المتصدرين</h3>
              <p className="text-slate-300 mb-8 text-lg">تنافس مع اللاعبين حول العالم واكسب مكانك بين أفضل اللاعبين.</p>
              <Link href="/leaderboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GamingButton variant="primary" glow>
                    <TrendingUp className="w-4 h-4 ml-2" />
                    عرض الترتيب
                  </GamingButton>
                </motion.div>
              </Link>
            </GamingCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.01 }}
        >
          <GamingCard className="p-12 text-center bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 border-blue-500/30 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
            </motion.div>
            <h3 className="text-4xl font-black mb-6">كن صانع محتوى</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg">شارك محتوى الألعاب الخاص بك، وبناء جمهورك، واكسب التقدير في مجتمع الألعاب.</p>
            <Link href="/creators">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <GamingButton variant="accent" size="lg" glow>
                  <Sparkles className="w-5 h-5 ml-2" />
                  انضم لبرنامج صناع المحتوى
                </GamingButton>
              </motion.div>
            </Link>
          </GamingCard>
        </motion.div>

        <motion.div
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center relative group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.1, y: -5 }}
            >
              <motion.div
                className={`absolute inset-0 ${stat.color} blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
              />
              <stat.icon className={`w-12 h-12 ${stat.color} mx-auto mb-4`} />
              <motion.div
                className={`text-5xl font-black ${stat.color} mb-2`}
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.2, type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-slate-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <footer className="relative bg-slate-900/50 backdrop-blur-xl border-t border-slate-800/50 py-12 px-6 mt-24">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { href: '/news', label: 'الأخبار', icon: Newspaper },
              { href: '/reviews', label: 'المراجعات', icon: Edit3 },
              { href: '/localization', label: 'مركز التعريب', icon: Languages },
              { href: '/gallery', label: 'معرض الوسائط', icon: Image },
              { href: '/translations', label: 'الترجمات', icon: Globe },
              { href: '/creators', label: 'صناع المحتوى' },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>
          <p className="text-center text-slate-500">2024 مركز الألعاب. جميع الحقوق محفوظة.</p>
        </motion.div>
      </footer>
    </div>
  );
}
