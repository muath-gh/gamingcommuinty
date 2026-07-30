"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Plus, Search, Gamepad2, Calendar, Filter, Activity } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../hooks/use-auth";
import { GamingButton } from "@/components/gaming/GamingButton";
import { GamingCard } from "@/components/gaming/GamingCard";
import { Badge } from "@/components/gaming/Badge";
import { GlowText } from "@/components/gaming/GlowText";
import { PlayerAvatar } from "@/components/gaming/PlayerAvatar";

type PlayRequest = {
  id: string;
  title: string;
  description: string;
  playersNeeded: number;
  user: { id: string; name: string; avatar: string };
  game: { id: string; name: string };
  participants: any[];
  createdAt: string;
};

export default function DiscoveryPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<PlayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/play-requests");
        if (res.ok) {
          const data = await res.json();
          setRequests(Array.isArray(data) ? data : data.playRequests ?? []);
        }
      } catch {
        // silent fail — empty state will show
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filtered = requests.filter(
    (r) =>
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.game?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen ambient-bg text-cream">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      {/* ================== HEADER ================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative glass-strong border-b border-neon-cyan/15 sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30">
                <Users className="w-6 h-6 text-neon-cyan-bright" />
              </div>
              <div>
                <p className="text-xs text-cream-muted tracking-wider font-bold">اكتشاف اللاعبين</p>
                <h1 className="font-display text-xl sm:text-2xl font-black text-cream">
                  ابحث عن <GlowText color="cyan">فريقك</GlowText>
                </h1>
              </div>
            </div>
            <Link href="/matchmaking/create">
              <GamingButton variant="primary" glow>
                <Plus className="w-5 h-5" />
                أنشئ طلب لعب
              </GamingButton>
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ================== SEARCH BAR ================== */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cream-dim" />
            <input
              type="text"
              placeholder="ابحث عن لعبة أو طلب لعب..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-gaming w-full rounded-xl pr-12 pl-4 py-3.5 text-right"
              dir="rtl"
            />
          </div>
        </motion.div>

        {/* ================== LOADING STATE ================== */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-xl surface p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full skeleton-shimmer" />
                  <div className="flex-1">
                    <div className="h-4 w-24 skeleton-shimmer rounded mb-2" />
                    <div className="h-3 w-16 skeleton-shimmer rounded" />
                  </div>
                </div>
                <div className="h-5 w-3/4 skeleton-shimmer rounded mb-3" />
                <div className="h-3 w-full skeleton-shimmer rounded mb-2" />
                <div className="h-3 w-2/3 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        )}

        {/* ================== EMPTY STATE ================== */}
        {!loading && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <GamingCard className="p-12 text-center max-w-md">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-neon-cyan/8 border border-neon-cyan/20 mb-6">
                <Gamepad2 className="w-10 h-10 text-neon-cyan-bright opacity-70" />
              </div>
              <h2 className="font-display text-2xl font-black text-cream mb-3">
                لا توجد طلبات لعب حالياً
              </h2>
              <p className="text-cream-muted mb-8 leading-relaxed">
                كن أول من ينشئ طلب لعب وابدأ بتجميع فريقك
              </p>
              <Link href="/matchmaking/create">
                <GamingButton variant="primary" glow>
                  <Plus className="w-5 h-5" />
                  أنشئ أول طلب
                </GamingButton>
              </Link>
            </GamingCard>
          </motion.div>
        )}

        {/* ================== REQUESTS GRID ================== */}
        {!loading && filtered.length > 0 && (
          <>
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-neon-cyan-bright" />
              <span className="text-sm text-cream-muted font-bold">
                {filtered.length} طلب لعب متاح
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((req, index) => {
                const spotsLeft = req.playersNeeded - req.participants.length;
                const isFull = spotsLeft <= 0;
                return (
                  <motion.div
                    key={req.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={`/play-requests/${req.id}`}>
                      <motion.div whileHover={{ y: -6, scale: 1.015 }} whileTap={{ scale: 0.98 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
                        <GamingCard hover glow accent="cyan" className="p-6 h-full flex flex-col">
                          {/* Header: game + status */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-ink-925 border border-neon-cyan/15">
                                <Gamepad2 className="w-4 h-4 text-neon-cyan-bright" />
                              </div>
                              <span className="text-sm font-bold text-cream-muted truncate max-w-[140px]">
                                {req.game?.name ?? "غير محدد"}
                              </span>
                            </div>
                            {isFull ? (
                              <Badge variant="danger" size="sm">ممتلئة</Badge>
                            ) : (
                              <Badge variant="success" size="sm" glow>
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-live-dot" />
                                متاحة
                              </Badge>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="font-display text-lg font-bold text-cream mb-2 line-clamp-1">
                            {req.title}
                          </h3>

                          {/* Description */}
                          <p className="text-sm text-cream-muted leading-relaxed mb-5 line-clamp-2 flex-1">
                            {req.description}
                          </p>

                          {/* Footer: owner + spots */}
                          <div className="flex items-center justify-between pt-4 border-t border-neon-cyan/10">
                            <div className="flex items-center gap-2.5">
                              <PlayerAvatar name={req.user?.name ?? "?"} size="sm" />
                              <div>
                                <p className="text-xs font-bold text-cream truncate max-w-[100px]">
                                  {req.user?.name ?? "لاعب"}
                                </p>
                                <p className="text-xs text-cream-dim">صاحب الطلب</p>
                              </div>
                            </div>
                            <div className="text-left">
                              <p className="font-display text-xl font-black text-neon-cyan-bright">
                                {req.participants.length}/{req.playersNeeded}
                              </p>
                              <p className="text-xs text-cream-dim">لاعبين</p>
                            </div>
                          </div>
                        </GamingCard>
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
