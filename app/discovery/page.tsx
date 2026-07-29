"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/use-auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  Search,
  LogOut,
  Eye,
  X,
  Filter,
  Gamepad2,
  Users,
  Clock,
  Mic,
  MicOff,
  Trophy,
  Target,
  Zap,
  Globe,
  MessageCircle,
  Shield,
  Star,
  Swords,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { GamingCard } from "@/components/gaming/GamingCard";
import { GamingButton } from "@/components/gaming/GamingButton";
import { Badge } from "@/components/gaming/Badge";
import { GlowText } from "@/components/gaming/GlowText";
import { timeAgo } from "../../lib/utils";
import { GameAutocomplete } from "@/components/gaming/GameAutocomplete";
type ValidationError = { field: string; message: string };

// ── ستاتيك (ما بتتغير) ─────────────────────────────────────────────────
const GAME_ICONS: Record<string, string> = {
  فالورانت: "🎯",
  valorant: "🎯",
  "ليج أوف ليجندز": "⚔️",
  "league-of-legends": "⚔️",
  "أبيكس ليجندز": "🎮",
  "apex-legends": "🎮",
  "cs:go": "🔫",
  csgo: "🔫",
  فورتنايت: "🌟",
  fortnite: "🌟",
  "أوفرواتش 2": "🛡️",
  "overwatch-2": "🛡️",
  "روكيت ليج": "🚗",
  "rocket-league": "🚗",
  ماينكرافت: "🟫",
  minecraft: "🟫",
};

const GAME_COLORS = [
  "from-red-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-orange-500 to-red-500",
  "from-yellow-500 to-orange-500",
  "from-purple-500 to-pink-500",
  "from-orange-400 to-yellow-500",
  "from-blue-400 to-purple-500",
  "from-green-500 to-emerald-600",
];

const PLATFORM_ICONS: Record<string, string> = {
  pc: "💻",
  الحاسوب: "💻",
  playstation: "🎮",
  بلايستيشن: "🎮",
  xbox: "🎯",
  "إكس بوكس": "🎯",
  "nintendo-switch": "🕹️",
  "نينتندو سويتش": "🕹️",
  mobile: "📱",
  الجوال: "📱",
};

const PLATFORM_COLORS: Record<string, string> = {
  pc: "from-blue-500 to-cyan-500",
  playstation: "from-blue-600 to-indigo-600",
  xbox: "from-green-500 to-emerald-500",
  "nintendo-switch": "from-red-500 to-pink-500",
  mobile: "from-purple-500 to-pink-500",
};

const activityTypes = [
  {
    name: "تصنيف",
    icon: Trophy,
    color: "text-yellow-400",
    bg: "from-yellow-500/20 to-orange-500/20",
  },
  {
    name: "عادي",
    icon: Gamepad2,
    color: "text-cyan-400",
    bg: "from-cyan-500/20 to-blue-500/20",
  },
  {
    name: "تعاوني",
    icon: Users,
    color: "text-green-400",
    bg: "from-green-500/20 to-emerald-500/20",
  },
  {
    name: "بطولة",
    icon: Target,
    color: "text-pink-400",
    bg: "from-pink-500/20 to-rose-500/20",
  },
];

const teamSizes = ["1ضد1", "2ضد2", "3ضد3", "5ضد5", "فريق", "أي"];

// ── Types ───────────────────────────────────────────────────────────────
type GameFromDB = {
  id: string;
  name: string;
  slug: string;
  playRequestsCount: number;
};

type PlatformFromDB = {
  id: string;
  name: string;
  slug: string;
  icon?: string | null;
};

export default function PlayerDiscoveryPage() {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  );
  const [playRequests, setPlayRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ── من الداتابيز ────────────────────────────────────────────────────
  const [popularGames, setPopularGames] = useState<GameFromDB[]>([]);
  const [platforms, setPlatforms] = useState<PlatformFromDB[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [joiningId, setJoiningId] = useState<string | null>(null); // ✅ track الانضمام

  // ── Filters ─────────────────────────────────────────────────────────
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [voiceOnly, setVoiceOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null,
  );
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { user: currentUser } = useAuth();
  // ── Form ─────────────────────────────────────────────────────────────
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<{
    gameId: string;
    title: string;
    description: string;
    playersNeeded: number | null; // ✅ null أو number
  }>({
    gameId: "",
    title: "",
    description: "",
    playersNeeded: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Fetch ────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await fetch("/api/play-requests");
      const data = await res.json();
      setPlayRequests(data);
      setLoading(false);
    };
    load();
  }, []);
  const handleLeaveRequest = async (requestId: string) => {
    setLeavingId(requestId);
    try {
      const res = await fetch(`/api/play-requests/${requestId}/leave`, {
        method: "POST",
        headers: {
          "x-user-id": currentUser?.id || "",
        },
      });

      if (!res.ok) throw new Error("فشل المغادرة");

      // حدّث الـ UI
      setPlayRequests((prev) =>
        prev.map((pr) =>
          pr.id === requestId
            ? {
                ...pr,
                participants: pr.participants.filter(
                  (p: any) => p.userId !== currentUser?.id,
                ),
                isOpen: true, // إعادة فتح الطلب
              }
            : pr,
        ),
      );

      toast.success("✅ تم المغادرة بنجاح");
    } catch (error) {
      toast.error("❌ فشل المغادرة");
    } finally {
      setLeavingId(null);
    }
  };
  // 1️⃣ تحديث الـ UI
  const handleJoinRequest = async (requestId: string) => {
    setJoiningId(requestId); // ✅ ابدأ الـ animation

    try {
      const res = await fetch(`/api/play-requests/${requestId}/join`, {
        method: "POST",
        headers: {
          "x-user-id": currentUser?.id || "",
        },
      });

      if (!res.ok) throw new Error("فشل الانضمام");

      toast.success("✅ تم الانضمام بنجاح!");

      // انتقل مع animation
      setTimeout(() => {
        router.push(`/play-requests/${requestId}`);
      }, 1000);
    } catch (error) {
      toast.error("❌ فشل الانضمام");
      setJoiningId(null); // ✅ أوقف الـ animation
    }
  };
  const handleDeleteRequest = async (requestId: string) => {
    setDeletingId(requestId);
    try {
      const res = await fetch(`/api/play-requests/${requestId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": currentUser?.id || "", // ✅ أرسل الـ ID
        },
      });
      if (!res.ok) throw new Error("فشل الحذف");

      setPlayRequests((prev) => prev.filter((r) => r.id !== requestId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error("Error deleting request:", error);
    } finally {
      setDeletingId(null);
    }
  };
  useEffect(() => {
    fetch("/api/games")
      .then((r) => r.json())
      .then(setGames);
    fetch("/api/games/popular")
      .then((r) => r.json())
      .then(setPopularGames);
    fetch("/api/platforms")
      .then((r) => r.json())
      .then(setPlatforms);
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────
  const getGameIcon = (name: string, slug: string) =>
    GAME_ICONS[name.toLowerCase()] ?? GAME_ICONS[slug] ?? "🎮";

  const getGameColor = (index: number) =>
    GAME_COLORS[index % GAME_COLORS.length];

  const getPlatformIcon = (slug: string, name: string) =>
    PLATFORM_ICONS[slug] ?? PLATFORM_ICONS[name] ?? "🖥️";

  const getPlatformColor = (slug: string) =>
    PLATFORM_COLORS[slug] ?? "from-slate-500 to-slate-600";

  // ── Handlers ─────────────────────────────────────────────────────────
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];
    if (!formData.gameId)
      errors.push({ field: "gameId", message: "الرجاء اختيار اللعبة" });
    if (!formData.playersNeeded || formData.playersNeeded === null)
      // ✅ إضافة check
      errors.push({
        field: "playersNeeded",
        message: "حدد عدد اللاعبين المطلوبين",
      });
    if (!formData.title.trim())
      errors.push({ field: "title", message: "عنوان الطلب مطلوب" });
    else if (formData.title.length < 5)
      errors.push({
        field: "title",
        message: "العنوان يجب أن يكون 5 أحرف على الأقل",
      });
    if (!formData.description.trim())
      errors.push({ field: "description", message: "الوصف مطلوب" });

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCreateRequest = async () => {
    setValidationErrors([]);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/play-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("فشل إنشاء الطلب");
      const newRequest = await res.json();
      setPlayRequests((prev) => [newRequest, ...prev]);
      setFormData({
        gameId: "",
        title: "",
        description: "",
        playersNeeded: null, // ✅ بدل 4
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlatform = (platform: string) =>
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );

  const toggleActivity = (activity: string) =>
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity],
    );

  const clearFilters = () => {
    setSelectedGame(null);
    setSelectedPlatforms([]);
    setSelectedActivities([]);
    setSelectedTeamSize(null);
    setVoiceOnly(false);
    setSearchQuery("");
  };

  // ── Render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 max-w-md w-full border-2 border-red-500/30 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-red-500/5"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              <div className="relative">
                <motion.div
                  animate={{ rotate: [0, -5, 5, 0] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                  className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6"
                >
                  <Trash2 className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-3xl font-bold text-center mb-3">
                  هل أنت متأكد؟
                </h3>
                <p className="text-slate-300 text-center mb-8 leading-relaxed">
                  سيتم حذف طلب اللعب بشكل نهائي ولا يمكن التراجع عنه. جميع طلبات
                  الانضمام ستُلغى أيضاً.
                </p>

                <div className="flex gap-4 flex-row-reverse">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteRequest(showDeleteConfirm)}
                    disabled={deletingId === showDeleteConfirm}
                    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    {deletingId === showDeleteConfirm ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        ⏳
                      </motion.div>
                    ) : (
                      "حذف نهائياً"
                    )}
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(null)}
                    disabled={deletingId === showDeleteConfirm}
                    className="flex-1 bg-slate-700/50 hover:bg-slate-600/50 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50"
                  >
                    إلغاء
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-cyan-900/20 to-slate-900 py-16 px-6">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress')] opacity-5 bg-cover bg-center" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge variant="success" glow className="mb-6 inline-flex">
              <Users className="w-4 h-4 ml-2" />
              {playRequests.length}+ طلب لعب نشط
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black mb-4">
              ابحث عن <GlowText color="blue">فريقك</GlowText>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              تواصل مع اللاعبين الذين يطابقون أسلوب لعبك ومستوى مهارتك
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن لعبة، لاعب، أو وسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl pr-16 pl-6 py-5 text-lg focus:outline-none focus:border-cyan-500 transition-all text-right"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery("")}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Create Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <AnimatePresence mode="wait">
            {!showCreateForm ? (
              <motion.div
                key="cta"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl blur-2xl opacity-30"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateForm(true)}
                  className="relative w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl p-8 overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <motion.div
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center"
                      >
                        <Plus
                          className="w-10 h-10 text-white"
                          strokeWidth={3}
                        />
                      </motion.div>
                      <div className="text-right">
                        <h3 className="text-3xl font-black text-white mb-2 flex items-center gap-3 justify-end">
                          أنشئ طلب لعب جديد
                        </h3>
                        <p className="text-cyan-50 text-lg">
                          ابحث عن زملاء اللعب المثاليين لجلستك القادمة
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Zap
                        className="w-12 h-12 text-yellow-300"
                        fill="currentColor"
                      />
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                dir="rtl"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <GamingCard className="p-10 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-500/30 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-cyan-500/10"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8 flex-row-reverse">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateForm(false)}
                        className="px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl flex items-center gap-2 transition-all border border-slate-700"
                      >
                        <X className="w-5 h-5" /> إلغاء
                      </motion.button>
                      <div className="text-right">
                        <h2 className="text-4xl font-black flex items-center gap-3 justify-end">
                          <Sparkles className="w-8 h-8 text-cyan-400" />
                          <GlowText color="blue">طلب لعب جديد</GlowText>
                        </h2>
                        <p className="text-slate-400 mt-2">
                          املأ التفاصيل لإنشاء طلبك
                        </p>
                      </div>
                    </div>

                    <AnimatePresence>
                      {validationErrors.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -20 }}
                          animate={{ opacity: 1, height: "auto", y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -20 }}
                          transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 300,
                          }}
                          className="mb-6 overflow-hidden"
                        >
                          <div className="relative bg-gradient-to-br from-red-500/10 via-red-600/10 to-pink-500/10 border-2 border-red-500/50 rounded-2xl p-5 space-y-2">
                            {validationErrors.map((error, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center gap-2 text-red-300 bg-red-500/10 p-2.5 rounded-lg border border-red-500/30"
                              >
                                <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                                <span className="text-sm font-medium">
                                  {error.message}
                                </span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-3"
                      >
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end flex-row-reverse">
                          <span className="text-cyan-400">*</span> اللعبة{" "}
                          <Gamepad2 className="w-5 h-5 text-cyan-400" />
                        </label>
                        <GameAutocomplete
                          value={formData.gameId}
                          onChange={(gameId, gameName) =>
                            setFormData({ ...formData, gameId })
                          }
                          placeholder="ابحث عن اللعبة..."
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-3"
                      >
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end flex-row-reverse">
                          <span className="text-cyan-400">*</span> عدد اللاعبين
                          المطلوبين <Users className="w-5 h-5 text-cyan-400" />
                        </label>
                        <div className="flex gap-3">
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <motion.button
                              key={num}
                              whileHover={{ scale: 1.1, y: -3 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() =>
                                setFormData({ ...formData, playersNeeded: num })
                              }
                              className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${formData.playersNeeded === num ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 border border-slate-700"}`}
                            >
                              {num}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-2 space-y-3"
                      >
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end flex-row-reverse">
                          <span className="text-cyan-400">*</span> عنوان الطلب{" "}
                          <Star className="w-5 h-5 text-cyan-400" />
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          placeholder="مثال: أبحث عن فريق تنافسي للتصنيف"
                          className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-cyan-500 transition-all text-right"
                        />
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="md:col-span-2 space-y-3"
                      >
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end flex-row-reverse">
                          <span className="text-cyan-400">*</span> الوصف{" "}
                          <MessageCircle className="w-5 h-5 text-cyan-400" />
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
                          placeholder="اكتب وصفاً تفصيلياً عن نوع اللاعبين الذين تبحث عنهم..."
                          rows={6}
                          className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-cyan-500 transition-all text-right resize-none"
                        />
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 flex gap-4 flex-row-reverse"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowCreateForm(false)}
                        className="px-8 py-4 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl font-semibold text-lg transition-all border border-slate-700"
                      >
                        إلغاء
                      </motion.button>
                      <motion.button
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 0 30px rgba(34, 211, 238, 0.6)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateRequest}
                        disabled={
                          isSubmitting ||
                          !formData.gameId ||
                          !formData.title ||
                          !formData.description
                        }
                        className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${isSubmitting || !formData.gameId || !formData.title || !formData.description ? "bg-slate-700 text-slate-500 cursor-not-allowed" : "bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/50"}`}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                            >
                              <Target className="w-6 h-6" />
                            </motion.div>{" "}
                            جاري النشر...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" /> نشر الطلب{" "}
                            <Sparkles className="w-5 h-5" />
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  </div>
                </GamingCard>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Popular Games — من الداتابيز */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <Gamepad2 className="w-8 h-8 text-cyan-400" />
              الألعاب الأكثر نشاطاً
            </h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700 hover:border-cyan-500 transition-all"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? "إخفاء الفلاتر" : "إظهار الفلاتر"}
            </motion.button>
          </div>

          {popularGames?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-64 rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl flex flex-col items-center justify-center gap-4"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Gamepad2 className="w-16 h-16 text-slate-600" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-300 mb-2">
                  لا توجد ألعاب حالياً
                </h3>
                <p className="text-slate-500 text-sm">
                  ابدأ باللعب وكن الأول! 🚀
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {popularGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    setSelectedGame(game.id === selectedGame ? null : game.id)
                  }
                  className="cursor-pointer"
                >
                  <GamingCard
                    hover
                    glow={selectedGame === game.id}
                    className={`p-6 text-center relative overflow-hidden transition-all ${selectedGame === game.id ? "ring-2 ring-cyan-500" : ""}`}
                  >
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${getGameColor(index)} ${selectedGame === game.id ? "opacity-20" : "opacity-0"} transition-opacity`}
                    />
                    <div className="text-4xl mb-3 relative">
                      {getGameIcon(game.name, game.slug)}
                    </div>
                    <h3 className="text-sm font-bold mb-2 relative">
                      {game.name}
                    </h3>
                    <Badge variant="info" className="text-xs">
                      <Users className="w-3 h-3 ml-1" />
                      {game.playRequestsCount}
                    </Badge>
                  </GamingCard>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <GamingCard className="p-8 mb-12 bg-slate-900/50 backdrop-blur-xl">
                <div className="space-y-8">
                  {/* Platforms — من الداتابيز */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Globe className="w-6 h-6 text-purple-400" /> المنصة
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {platforms.map((platform, index) => (
                        <motion.button
                          key={platform.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => togglePlatform(platform.id)}
                          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all ${selectedPlatforms.includes(platform.id) ? `bg-gradient-to-r ${getPlatformColor(platform.slug)} text-white shadow-lg` : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"}`}
                        >
                          <span className="text-xl">
                            {platform.icon ??
                              getPlatformIcon(platform.slug, platform.name)}
                          </span>
                          {platform.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Activity — ستاتيك */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Target className="w-6 h-6 text-orange-400" /> نوع النشاط
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {activityTypes.map((activity, index) => (
                        <motion.button
                          key={activity.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleActivity(activity.name)}
                          className={`p-6 rounded-2xl border-2 transition-all ${selectedActivities.includes(activity.name) ? `border-cyan-500 bg-gradient-to-br ${activity.bg}` : "border-slate-700 bg-slate-800/30 hover:border-slate-600"}`}
                        >
                          <activity.icon
                            className={`w-8 h-8 ${activity.color} mx-auto mb-3`}
                          />
                          <p className="font-bold">{activity.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Team Size — ستاتيك */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6 text-green-400" /> حجم الفريق
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {teamSizes.map((size, index) => (
                        <motion.button
                          key={size}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setSelectedTeamSize(
                              size === selectedTeamSize ? null : size,
                            )
                          }
                          className={`w-20 h-20 rounded-2xl font-bold text-lg transition-all ${selectedTeamSize === size ? "bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/50" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"}`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Voice */}
                  <div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setVoiceOnly(!voiceOnly)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all flex items-center justify-center gap-4 ${voiceOnly ? "border-blue-500 bg-gradient-to-r from-blue-500/20 to-cyan-500/20" : "border-slate-700 bg-slate-800/30 hover:border-slate-600"}`}
                    >
                      {voiceOnly ? (
                        <Mic className="w-6 h-6 text-blue-400" />
                      ) : (
                        <MicOff className="w-6 h-6 text-slate-400" />
                      )}
                      <span className="text-xl font-bold">
                        مطلوب دردشة صوتية
                      </span>
                    </motion.button>
                  </div>

                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={clearFilters}
                      className="px-8 py-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl font-semibold transition-all"
                    >
                      مسح جميع الفلاتر
                    </motion.button>
                  </div>
                </div>
              </GamingCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Play Requests */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-3">
            <Users className="w-8 h-8 text-cyan-400" />
            اللاعبون المتاحون
          </h2>
          <Badge variant="success" className="text-lg px-6 py-2">
            <Zap className="w-5 h-5 ml-2" />
            {playRequests.length} طلب نشط
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 rounded-2xl bg-slate-800/50 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {playRequests.map((playRequest, index) => (
              <motion.div
                key={playRequest.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <GamingCard
                  hover
                  glow
                  className="p-8 relative overflow-hidden group h-full"
                >
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-right">
                        <Badge variant="success" className="mb-2">
                          <Clock className="w-3 h-3 ml-1" />
                          {timeAgo(playRequest.createdAt)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-1 text-right">
                            {playRequest.user.name}
                          </h3>
                          <p className="text-slate-400 text-sm text-right">
                            {playRequest.title}
                          </p>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl">
                          {playRequest.user.avatar ?? "🎮"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4 justify-end">
                      <Badge variant="info">
                        <Gamepad2 className="w-3 h-3 ml-1" />
                        {playRequest.game.name}
                      </Badge>
                      <Badge variant="success">
                        <Users className="w-3 h-3 ml-1" />
                        {playRequest.participants.length} /{" "}
                        {playRequest.playersNeeded}
                      </Badge>
                    </div>

                    <p className="text-slate-300 mb-6 leading-relaxed text-right">
                      {playRequest.description}
                    </p>

                    <div className="flex gap-3">
                      {/* ✅ زر الحذف - يظهر فقط لصاحب الطلب */}
                      {currentUser?.id === playRequest.user.id && (
                        <>
                          <GamingButton
                            variant="ghost"
                            onClick={() => setShowDeleteConfirm(playRequest.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </GamingButton>
                          <GamingButton
                            variant="ghost"
                            onClick={() =>
                              router.push(`/play-requests/${playRequest.id}`)
                            }
                          >
                            <Eye className="w-4 h-4 ml-2" />
                          </GamingButton>
                        </>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1"
                      >
                        {currentUser?.id !== playRequest.user.id && (
                          <motion.div
                            whileHover={
                              joiningId !== playRequest.id
                                ? { scale: 1.05 }
                                : {}
                            }
                            whileTap={
                              joiningId !== playRequest.id
                                ? { scale: 0.95 }
                                : {}
                            }
                            animate={
                              joiningId === playRequest.id
                                ? { scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }
                                : {}
                            }
                            transition={{ duration: 0.5 }}
                          >
                            {/* ✅ تحقق هل انضم بالفعل */}
                            {playRequest.participants?.some(
                              (p: any) => p.userId === currentUser?.id,
                            ) ? (
                              // ✅ زر المغادرة
                              <div className="flex justify-around">
                                <GamingButton
                                  variant="ghost"
                                  className="w-1/2 m-1 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                                  onClick={() =>
                                    handleLeaveRequest(playRequest.id)
                                  }
                                  disabled={leavingId === playRequest.id}
                                >
                                  {leavingId === playRequest.id ? (
                                    <>
                                      <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                          duration: 1,
                                          repeat: Infinity,
                                        }}
                                        className="inline-block ml-2"
                                      >
                                        ⏳
                                      </motion.div>
                                      جاري المغادرة...
                                    </>
                                  ) : (
                                    <>
                                      <LogOut className="w-4 h-4 ml-2" /> غادر
                                      الطلب
                                    </>
                                  )}
                                </GamingButton>
                                <GamingButton
                                  variant="ghost"
                                  className="w-1/2 m-1 text-cyan-400 hover:text-cyan-300 border-cyan-500/30 hover:border-cyan-500/50"
                                  onClick={() =>
                                    router.push(
                                      `/play-requests/${playRequest.id}`,
                                    )
                                  }
                                >
                                  <Eye className="w-4 h-4 ml-2" />
                                  عرض الطلب
                                </GamingButton>
                              </div>
                            ) : (
                              // ✅ زر الانضمام
                              <GamingButton
                                variant="accent"
                                className="w-full"
                                glow
                                onClick={() =>
                                  handleJoinRequest(playRequest.id)
                                }
                                disabled={joiningId === playRequest.id}
                              >
                                {joiningId === playRequest.id ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{
                                        duration: 1,
                                        repeat: Infinity,
                                      }}
                                      className="inline-block ml-2"
                                    >
                                      ⏳
                                    </motion.div>
                                    جاري الانضمام...
                                  </>
                                ) : (
                                  <>
                                    <Users className="w-4 h-4 ml-2" /> انضم
                                    للطلب
                                  </>
                                )}
                              </GamingButton>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  </div>
                </GamingCard>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <GamingButton variant="primary" size="lg">
            تحميل المزيد من اللاعبين
          </GamingButton>
        </motion.div>
      </div>

      {/* FAB */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="fixed bottom-8 left-8 z-50"
      >
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-50"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <button className="relative w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 hover:shadow-2xl transition-all">
            <Star className="w-8 h-8 text-white" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
