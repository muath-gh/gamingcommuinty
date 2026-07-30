"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Trophy,
  Gamepad2,
  Image,
  Star,
  TrendingUp,
  Zap,
  Sparkles,
  Target,
  Shield,
  Swords,
  Newspaper,
  CreditCard as Edit3,
  Languages,
  Award,
  Lock,
} from "lucide-react";
import { GameCard } from "@/components/gaming/GameCard";
import { GamingButton } from "@/components/gaming/GamingButton";
import { GamingCard } from "@/components/gaming/GamingCard";
import { Badge } from "@/components/gaming/Badge";
import { GlowText } from "@/components/gaming/GlowText";
import { mockGames, getTrendingGames } from "@/lib/mockData";
import HeroAuthSection from "@/components/ui/hero-section";

const features = [
  {
    icon: Users,
    title: "اعثر على لاعبين",
    description: "تواصل مع اللاعبين حول العالم",
    href: "/discovery",
    comingSoon: false,
  },
  {
    icon: Languages,
    title: "مركز التعريب",
    description: "ألعاب معربة بالكامل للعربية",
    href: "/localization",
    comingSoon: true,
  },
  {
    icon: Image,
    title: "معرض الوسائط",
    description: "صور وفيديوهات من المجتمع",
    href: "/gallery",
    comingSoon: true,
  },
  {
    icon: Edit3,
    title: "مراجعات الألعاب",
    description: "تقييمات شاملة لأحدث الألعاب",
    href: "/reviews",
    comingSoon: true,
  },
  {
    icon: Newspaper,
    title: "أخبار الألعاب",
    description: "آخر الأخبار والمستجدات",
    href: "/news",
    comingSoon: true,
  },
  {
    icon: Trophy,
    title: "تنافس",
    description: "تسلق قوائم المتصدرين",
    href: "/leaderboard",
    comingSoon: true,
  },
];

const stats = [
  {
    value: "+50 مليون",
    label: "لاعب نشط",
    icon: Users,
    color: "text-blue-400",
  },
  {
    value: "+10 آلاف",
    label: "فريق وعشيرة",
    icon: Shield,
    color: "text-red-400",
  },
  {
    value: "+500 ألف",
    label: "مباراة يومية",
    icon: Swords,
    color: "text-emerald-400",
  },
  {
    value: "+1 مليون",
    label: "محتوى مرفوع",
    icon: Image,
    color: "text-amber-400",
  },
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
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen ambient-bg text-cream">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-40" />
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(32, 88, 154, 0.08), transparent 40%)`,
        }}
      />

      <motion.div
        className="relative overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800/20 to-ink-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-red/8 rounded-full blur-3xl animate-pulse-glow" />
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
              مركزك المثالي{" "}
              <span className="relative inline-block">
                <GlowText color="blue">للألعاب</GlowText>
              </span>
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl text-cream-muted mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              تواصل مع اللاعبين، وتصدر قوائم الترتيب، وابنِ إرثك في عالم الألعاب
            </motion.p>
            <HeroAuthSection />
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink-950 to-transparent" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative">
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
              <Link href={feature.comingSoon ? "#" : feature.href}>
                <motion.div
                  whileHover={feature.comingSoon ? {} : { y: -6, scale: 1.02 }}
                  whileTap={feature.comingSoon ? {} : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={
                    feature.comingSoon ? "cursor-not-allowed" : "cursor-pointer"
                  }
                  onClick={(e) => {
                    if (feature.comingSoon) {
                      e.preventDefault();
                      e.stopPropagation();
                    }
                  }}
                >
                  <GamingCard
                    hover={!feature.comingSoon}
                    glow={!feature.comingSoon}
                    className={`p-8 text-center h-full relative overflow-hidden group ${
                      feature.comingSoon
                        ? "opacity-60 grayscale-[30%]"
                        : "cursor-pointer"
                    }`}
                  >
                    {feature.comingSoon && (
                      <Badge
                        variant="info"
                        className="absolute top-4 left-4 text-xs flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" />
                        قريباً
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-neon-red/0 group-hover:from-neon-blue/8 group-hover:to-neon-red/8 transition-all duration-500" />
                    <motion.div
                      className="relative"
                      whileHover={
                        !feature.comingSoon ? { scale: 1.1, rotate: 5 } : {}
                      }
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <feature.icon className="w-14 h-14 text-blue-400 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-3 relative text-cream">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-cream-muted relative">
                      {feature.description}
                    </p>
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
              className="text-5xl font-black text-cream"
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
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <GamingCard
              gradient
              className="p-10 h-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-neon-red/0 group-hover:from-amber-500/8 group-hover:to-neon-red/8 transition-all duration-500" />
              <Zap className="w-16 h-16 text-amber-400 mb-6 relative" />
              <h3 className="text-3xl font-black mb-4 text-cream">
                أكمل المهام اليومية
              </h3>
              <p className="text-cream-muted mb-8 text-lg">
                اكسب نقاط الخبرة وافتح المكافآت الحصرية من خلال إكمال التحديات
                اليومية والأسبوعية.
              </p>
              <GamingButton
                variant="primary"
                glow
                disabled
                className="opacity-60 cursor-not-allowed"
              >
                <Award className="w-4 h-4 ml-2" />
                قريباً
              </GamingButton>
            </GamingCard>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <GamingCard
              gradient
              className="p-10 h-full relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/0 to-blue-400/0 group-hover:from-neon-blue/8 group-hover:to-blue-400/8 transition-all duration-500" />
              <Trophy className="w-16 h-16 text-blue-400 mb-6 relative" />
              <h3 className="text-3xl font-black mb-4 text-cream">
                تسلق قائمة المتصدرين
              </h3>
              <p className="text-cream-muted mb-8 text-lg">
                تنافس مع اللاعبين حول العالم واكسب مكانك بين أفضل اللاعبين.
              </p>
              <GamingButton
                variant="primary"
                glow
                disabled
                className="opacity-60 cursor-not-allowed"
              >
                <TrendingUp className="w-4 h-4 ml-2" />
                قريباً
              </GamingButton>
            </GamingCard>
          </motion.div>
        </motion.div>
      </div>

      <footer className="relative glass-strong border-t border-neon-blue/15 py-12 px-6 mt-24">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {[
              { href: "/news", label: "الأخبار", icon: Newspaper },
              { href: "/reviews", label: "المراجعات", icon: Edit3 },
              { href: "/localization", label: "مركز التعريب", icon: Languages },
              { href: "/gallery", label: "معرض الوسائط", icon: Image },
            ].map((link) => (
              <Link key={link.href} href={link.href}>
                <motion.div
                  className="text-cream-muted hover:text-cream transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </motion.div>
              </Link>
            ))}
          </div>
          <p className="text-center text-cream-muted/60">
            2026 مركز الألعاب. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
