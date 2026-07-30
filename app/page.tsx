"use client";
import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  Users,
  Trophy,
  Gamepad2,
  Image as ImageIcon,
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
  Activity,
  MessageSquare,
  Circle,
} from "lucide-react";
import { GameCard } from "@/components/gaming/GameCard";
import { GamingButton } from "@/components/gaming/GamingButton";
import { GamingCard } from "@/components/gaming/GamingCard";
import { Badge } from "@/components/gaming/Badge";
import { GlowText } from "@/components/gaming/GlowText";
import { PlayerAvatar } from "@/components/gaming/PlayerAvatar";
import { mockGames, getTrendingGames } from "@/lib/mockData";
import HeroAuthSection from "@/components/ui/hero-section";

const features = [
  {
    icon: Users,
    title: "اعثر على لاعبين",
    description: "تواصل مع اللاعبين حول العالم",
    href: "/discovery",
    comingSoon: false,
    accent: "cyan" as const,
  },
  {
    icon: Languages,
    title: "مركز التعريب",
    description: "ألعاب معربة بالكامل للعربية",
    href: "/localization",
    comingSoon: true,
    accent: "amber" as const,
  },
  {
    icon: ImageIcon,
    title: "معرض الوسائط",
    description: "صور وفيديوهات من المجتمع",
    href: "/gallery",
    comingSoon: true,
    accent: "cyan" as const,
  },
  {
    icon: Edit3,
    title: "مراجعات الألعاب",
    description: "تقييمات شاملة لأحدث الألعاب",
    href: "/reviews",
    comingSoon: true,
    accent: "amber" as const,
  },
  {
    icon: Newspaper,
    title: "أخبار الألعاب",
    description: "آخر الأخبار والمستجدات",
    href: "/news",
    comingSoon: true,
    accent: "cyan" as const,
  },
  {
    icon: Trophy,
    title: "تنافس",
    description: "تسلق قوائم المتصدرين",
    href: "/leaderboard",
    comingSoon: true,
    accent: "amber" as const,
  },
];

const stats = [
  { value: "+50 مليون", label: "لاعب نشط", icon: Users, color: "text-neon-cyan-bright" },
  { value: "+10 آلاف", label: "فريق وعشيرة", icon: Shield, color: "text-neon-crimson-bright" },
  { value: "+500 ألف", label: "مباراة يومية", icon: Swords, color: "text-success" },
  { value: "+1 مليون", label: "محتوى مرفوع", icon: ImageIcon, color: "text-neon-amber-bright" },
];

const liveActivity = [
  { name: "أحمد_برو", action: "انضم إلى غرفة", target: "فالورانت - رتبة", time: "الآن", rank: "diamond" as const },
  { name: "سارة_جيمر", action: "أنشأ طلب لعب", target: "أبطال البرق", time: "قبل دقيقة", rank: "platinum" as const },
  { name: "خالد_سنايبر", action: "تسلق إلى", target: "الرتبة الذهبية", time: "قبل 3 دقائق", rank: "gold" as const },
  { name: "نورا_قناصة", action: "انضم إلى غرفة", target: "أبيكس ليجندز", time: "قبل 5 دقائق", rank: "platinum" as const },
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
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(20, 184, 196, 0.07), transparent 40%)`,
        }}
      />

      {/* ================== HERO ================== */}
      <motion.div
        className="relative overflow-hidden"
        style={{ opacity, scale }}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800/20 to-ink-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/50 to-transparent" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-neon-crimson/8 rounded-full blur-3xl animate-pulse-glow" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-28 md:py-36">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge variant="info" glow className="mb-8 inline-flex">
                <Sparkles className="w-4 h-4" />
                انضم إلى +50 مليون لاعب حول العالم
              </Badge>
            </motion.div>

            <motion.h1
              className="font-display text-6xl md:text-8xl font-black mb-8 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              مركزك المثالي{" "}
              <span className="relative inline-block">
                <GlowText color="cyan">للألعاب</GlowText>
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

      {/* ================== STATS BAR ================== */}
      <div className="relative max-w-7xl mx-auto px-6 -mt-8 mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <GamingCard className="p-5 md:p-6 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-ink-925 border border-neon-cyan/15">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="font-display text-2xl md:text-3xl font-black text-cream">{stat.value}</p>
                  <p className="text-sm text-cream-muted">{stat.label}</p>
                </div>
              </GamingCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ================== FEATURE GRID ================== */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-neon-cyan-bright" />
            </div>
            <span className="text-sm font-bold text-cream-muted tracking-wider">الميزات</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-cream">
            كل ما تحتاجه <GlowText color="cyan">كمجتمع ألعاب</GlowText>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link href={feature.comingSoon ? "#" : feature.href}>
                <motion.div
                  whileHover={feature.comingSoon ? {} : { y: -6, scale: 1.02 }}
                  whileTap={feature.comingSoon ? {} : { scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={feature.comingSoon ? "cursor-not-allowed" : "cursor-pointer"}
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
                    accent={feature.accent}
                    className={`p-8 h-full relative overflow-hidden group ${
                      feature.comingSoon ? "opacity-60 grayscale-[30%]" : ""
                    }`}
                  >
                    {feature.comingSoon && (
                      <Badge variant="info" className="absolute top-4 left-4 text-xs">
                        <Lock className="w-3 h-3" />
                        قريباً
                      </Badge>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/0 group-hover:from-neon-cyan/8 group-hover:to-transparent transition-all duration-500" />
                    <motion.div
                      className="relative mb-5"
                      whileHover={!feature.comingSoon ? { scale: 1.1, rotate: 4 } : {}}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl border ${
                        feature.accent === 'amber'
                          ? 'bg-neon-amber/8 border-neon-amber/25'
                          : 'bg-neon-cyan/8 border-neon-cyan/25'
                      }`}>
                        <feature.icon className={`w-8 h-8 ${feature.accent === 'amber' ? 'text-neon-amber-bright' : 'text-neon-cyan-bright'}`} />
                      </div>
                    </motion.div>
                    <h3 className="font-display text-2xl font-bold mb-2 relative text-cream">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-cream-muted relative leading-relaxed">
                      {feature.description}
                    </p>
                  </GamingCard>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================== TRENDING GAMES ================== */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-wrap justify-between items-center gap-4 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-neon-crimson/10 border border-neon-crimson/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-neon-crimson-bright" />
                </div>
                <span className="text-sm font-bold text-cream-muted tracking-wider">الأكثر شعبية</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black text-cream">
                الألعاب <GlowText color="cyan">الرائجة</GlowText>
              </h2>
            </div>
            <Link href="/games">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <GamingButton variant="ghost">
                  عرض الكل
                  <TrendingUp className="w-4 h-4" />
                </GamingButton>
              </motion.div>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingGames.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
      </div>

      {/* ================== LIVE COMMUNITY ACTIVITY ================== */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="relative flex h-3 w-3">
              <span className="animate-live-dot absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-cream">
              المجتمع <span className="text-success">حيّ الآن</span>
            </h2>
          </div>
          <GamingCard className="p-6 md:p-8">
            <div className="space-y-3">
              {liveActivity.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-ink-850/60 transition-colors"
                >
                  <PlayerAvatar name={item.name} size="md" rank={item.rank} online showStatus />
                  <div className="flex-1 min-w-0">
                    <p className="text-cream font-bold truncate">
                      {item.name} <span className="text-cream-muted font-normal">— {item.action}</span>{" "}
                      <span className="text-neon-cyan-bright">{item.target}</span>
                    </p>
                  </div>
                  <span className="text-xs text-cream-dim flex items-center gap-1 flex-shrink-0">
                    <Circle className="w-1.5 h-1.5 fill-success text-success" />
                    {item.time}
                  </span>
                </motion.div>
              ))}
            </div>
          </GamingCard>
        </motion.div>
      </div>

      {/* ================== CTA CARDS ================== */}
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <GamingCard accent="amber" glow className="p-8 md:p-10 h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-amber/0 to-neon-crimson/0 group-hover:from-neon-amber/10 group-hover:to-neon-crimson/5 transition-all duration-500" />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neon-amber/10 border border-neon-amber/30 mb-6 relative">
                <Zap className="w-8 h-8 text-neon-amber-bright" />
              </div>
              <h3 className="font-display text-3xl font-black mb-4 text-cream relative">
                أكمل المهام اليومية
              </h3>
              <p className="text-cream-muted mb-8 text-lg leading-relaxed relative">
                اكسب نقاط الخبرة وافتح المكافآت الحصرية من خلال إكمال التحديات اليومية والأسبوعية.
              </p>
              <GamingButton variant="secondary" glow disabled className="opacity-60 cursor-not-allowed">
                <Award className="w-4 h-4" />
                قريباً
              </GamingButton>
            </GamingCard>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02, y: -4 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}>
            <GamingCard accent="cyan" glow className="p-8 md:p-10 h-full relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/0 to-neon-cyan/0 group-hover:from-neon-cyan/10 group-hover:to-transparent transition-all duration-500" />
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 mb-6 relative">
                <Trophy className="w-8 h-8 text-neon-cyan-bright" />
              </div>
              <h3 className="font-display text-3xl font-black mb-4 text-cream relative">
                تسلق قائمة المتصدرين
              </h3>
              <p className="text-cream-muted mb-8 text-lg leading-relaxed relative">
                تنافس مع اللاعبين حول العالم واكسب مكانك بين أفضل اللاعبين.
              </p>
              <GamingButton variant="primary" glow disabled className="opacity-60 cursor-not-allowed">
                <TrendingUp className="w-4 h-4" />
                قريباً
              </GamingButton>
            </GamingCard>
          </motion.div>
        </motion.div>
      </div>

      {/* ================== FOOTER ================== */}
      <footer className="relative glass-strong border-t border-neon-cyan/15 py-12 px-6 mt-24">
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
              { href: "/gallery", label: "معرض الوسائط", icon: ImageIcon },
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
          <div className="tech-divider mb-8 max-w-md mx-auto" />
          <p className="text-center text-cream-dim">
            2026 مركز الألعاب. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </footer>
    </div>
  );
}
