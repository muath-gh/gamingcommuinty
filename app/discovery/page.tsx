'use client';
import React, { useState,useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, Gamepad2, Users, Clock, Mic, MicOff, Trophy, Target, Zap, Globe, MessageCircle, Shield, Star, Swords, Plus, Send, Sparkles } from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GamingButton } from '@/components/gaming/GamingButton';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';
import {timeAgo} from '../../lib/utils';
type ValidationError = {
  field: string
  message: string
}
const popularGames = [
  { name: 'فالورانت', icon: '🎯', color: 'from-neon-red to-red-400', players: 2500 },
  { name: 'ليج أوف ليجندز', icon: '⚔️', color: 'from-neon-blue to-blue-400', players: 3200 },
  { name: 'أبيكس ليجندز', icon: '🎮', color: 'from-amber-500 to-red-400', players: 1800 },
  { name: 'CS:GO', icon: '🔫', color: 'from-amber-400 to-amber-600', players: 2100 },
  { name: 'فورتنايت', icon: '🌟', color: 'from-neon-blue to-cyan-400', players: 2800 },
  { name: 'أوفرواتش 2', icon: '🛡️', color: 'from-amber-400 to-amber-500', players: 1500 },
  { name: 'روكيت ليج', icon: '🚗', color: 'from-neon-blue to-blue-300', players: 1200 },
  { name: 'ماينكرافت', icon: '🟫', color: 'from-emerald-600 to-emerald-400', players: 3500 },
];

const platforms = [
  { name: 'الحاسوب', icon: '💻', color: 'from-neon-blue to-blue-400' },
  { name: 'بلايستيشن', icon: '🎮', color: 'from-neon-blue to-blue-500' },
  { name: 'إكس بوكس', icon: '🎯', color: 'from-emerald-600 to-emerald-400' },
  { name: 'نينتندو سويتش', icon: '🕹️', color: 'from-neon-red to-red-400' },
  { name: 'الجوال', icon: '📱', color: 'from-neon-blue to-cyan-400' },
];

const activityTypes = [
  { name: 'تصنيف', icon: Trophy, color: 'text-amber-400', bg: 'from-amber-500/20 to-orange-500/20' },
  { name: 'عادي', icon: Gamepad2, color: 'text-blue-400', bg: 'from-neon-blue/20 to-blue-500/20' },
  { name: 'تعاوني', icon: Users, color: 'text-emerald-400', bg: 'from-emerald-600/20 to-emerald-400/20' },
  { name: 'بطولة', icon: Target, color: 'text-red-400', bg: 'from-neon-red/20 to-red-400/20' },
];

const teamSizes = ['1ضد1', '2ضد2', '3ضد3', '5ضد5', 'فريق', 'أي'];

export default function PlayerDiscoveryPage() {
const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
const [playRequests, setPlayRequests] = useState<any[]>([])
const [loading, setLoading] = useState(true)
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedTeamSize, setSelectedTeamSize] = useState<string | null>(null);
  const [voiceOnly, setVoiceOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [games, setGames] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    gameId: '',
    title: '',
    description: '',
    playersNeeded: 4
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

useEffect(() => {
  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/play-requests')
    const data = await res.json()
    setPlayRequests(data)
    setLoading(false)
  }

  load()
}, [])

useEffect(() => {
  const loadGames = async () => {
    const res = await fetch('/api/games');
    const data = await res.json();
    setGames(data);
  };
  loadGames();
}, []);

const handleCreateRequest = async () => {
  setValidationErrors([])

  const isValid = validateForm()
  if (!isValid) return

  setIsSubmitting(true)

  try {
    const res = await fetch('/api/play-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
      }),
    })

    if (!res.ok) {
      throw new Error('فشل إنشاء الطلب')
    }

    const newRequest = await res.json()

    setPlayRequests(prev => [newRequest, ...prev])
    setFormData({
      gameId: '',
      title: '',
      description: '',
      playersNeeded: 4,
    })
    setShowCreateForm(false)
  } catch (error) {
    console.error('Error creating request:', error)
  } finally {
    setIsSubmitting(false)
  }
}
const validateForm = (): boolean => {
  const errors: ValidationError[] = []

  if (!formData.gameId) {
    errors.push({ field: 'gameId', message: 'الرجاء اختيار اللعبة' })
  }

  if (!formData.playersNeeded) {
    errors.push({ field: 'playersNeeded', message: 'حدد عدد اللاعبين المطلوبين' })
  }

  if (!formData.title.trim()) {
    errors.push({ field: 'title', message: 'عنوان الطلب مطلوب' })
  } else if (formData.title.length < 5) {
    errors.push({ field: 'title', message: 'العنوان يجب أن يكون 5 أحرف على الأقل' })
  }

  if (!formData.description.trim()) {
    errors.push({ field: 'description', message: 'الوصف مطلوب' })
  } else if (formData.description.length < 20) {
    errors.push({ field: 'description', message: 'الوصف يجب أن يكون 20 حرفًا على الأقل' })
  }

  setValidationErrors(errors)
  return errors.length === 0
}
  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev =>
      prev.includes(activity) ? prev.filter(a => a !== activity) : [...prev, activity]
    );
  };

  const clearFilters = () => {
    setSelectedGame(null);
    setSelectedPlatforms([]);
    setSelectedActivities([]);
    setSelectedTeamSize(null);
    setVoiceOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen ambient-bg text-cream">
      <div className="relative overflow-hidden py-16 px-6">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-red/8 rounded-full blur-3xl animate-pulse-glow" />
        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge variant="info" glow className="mb-6 inline-flex">
              <Users className="w-4 h-4 ml-2" />
              {playRequests.length}+ طلب لعب نشط
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black mb-4 text-cream">
              ابحث عن <GlowText color="blue">فريقك</GlowText>
            </h1>
            <p className="text-xl text-cream-muted max-w-3xl mx-auto">
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
              <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-cream-muted" />
              <input
                type="text"
                placeholder="ابحث عن لعبة، لاعب، أو وسم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-gaming rounded-2xl pr-16 pl-6 py-5 text-lg text-right"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 text-cream-muted hover:text-cream transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
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
                  className="absolute inset-0 bg-gradient-to-r from-neon-blue/30 via-transparent to-neon-red/30 rounded-2xl blur-xl opacity-40"
                  animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateForm(true)}
                  className="relative w-full surface surface-hover rounded-2xl p-8 overflow-hidden group"
                >
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <motion.div
                        whileHover={{ rotate: 180, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 glass rounded-2xl flex items-center justify-center neon-border-blue"
                      >
                        <Plus className="w-10 h-10 text-blue-400" strokeWidth={3} />
                      </motion.div>
                      <div className="text-right">
                        <h3 className="text-3xl font-black text-cream mb-2 flex items-center gap-3 justify-end">
                          <Sparkles className="w-8 h-8 text-blue-400" />
                          أنشئ طلب لعب جديد
                        </h3>
                        <p className="text-cream-muted text-lg">
                          ابحث عن زملاء اللعب المثاليين لجلستك القادمة
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Zap className="w-12 h-12 text-amber-400" fill="currentColor" />
                    </motion.div>
                  </div>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="overflow-hidden"
              >
                <GamingCard className="p-10 neon-border-blue relative overflow-hidden">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowCreateForm(false)}
                        className="btn-ghost px-6 py-3 rounded-xl flex items-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        إلغاء
                      </motion.button>

                      <div className="text-right">
                        <h2 className="text-4xl font-black flex items-center gap-3 justify-end text-cream">
                          <Sparkles className="w-8 h-8 text-blue-400" />
                          <GlowText color="blue">طلب لعب جديد</GlowText>
                        </h2>
                        <p className="text-cream-muted mt-2">املأ التفاصيل لإنشاء طلبك</p>
                      </div>
                    </div>
  <AnimatePresence>
    {validationErrors.length > 0 && (
      <motion.div
        initial={{ opacity: 0, height: 0, y: -20 }}
        animate={{ opacity: 1, height: 'auto', y: 0 }}
        exit={{ opacity: 0, height: 0, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="mb-6 overflow-hidden"
      >
        <div className="relative bg-neon-red/10 border border-neon-red/40 rounded-2xl p-5 space-y-2">
          {validationErrors.map((error, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2 text-red-300 bg-neon-red/10 p-2.5 rounded-lg border border-neon-red/20"
            >
              <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
              <span className="text-sm font-medium">{error.message}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end text-cream">
                          <span className="text-blue-400">*</span>
                          اللعبة
                          <Gamepad2 className="w-5 h-5 text-blue-400" />
                        </label>
                        <select
                          value={formData.gameId}
                          onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                          className="w-full input-gaming rounded-xl px-6 py-4 text-lg text-right"
                        >
                          <option value="">اختر اللعبة</option>
                          {games.map((game) => (
                            <option key={game.id} value={game.id}>{game.name}</option>
                          ))}
                        </select>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end text-cream">
                          <span className="text-blue-400">*</span>
                          عدد اللاعبين المطلوبين
                          <Users className="w-5 h-5 text-blue-400" />
                        </label>
                        <div className="flex gap-3">
                          {[2, 3, 4, 5, 6].map((num) => (
                            <motion.button
                              key={num}
                              whileHover={{ scale: 1.1, y: -3 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setFormData({ ...formData, playersNeeded: num })}
                              className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${
                                formData.playersNeeded === num
                                  ? 'btn-primary glow-blue'
                                  : 'btn-ghost'
                              }`}
                            >
                              {num}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="md:col-span-2 space-y-3">
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end text-cream">
                          <span className="text-blue-400">*</span>
                          عنوان الطلب
                          <Star className="w-5 h-5 text-blue-400" />
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="مثال: أبحث عن فريق تنافسي للتصنيف"
                          className="w-full input-gaming rounded-xl px-6 py-4 text-lg text-right"
                        />
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="md:col-span-2 space-y-3">
                        <label className="text-lg font-bold text-right block flex items-center gap-2 justify-end text-cream">
                          <span className="text-blue-400">*</span>
                          الوصف
                          <MessageCircle className="w-5 h-5 text-blue-400" />
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          placeholder="اكتب وصفاً تفصيلياً عن نوع اللاعبين الذين تبحث عنهم، أسلوب اللعب، المتطلبات..."
                          rows={6}
                          className="w-full input-gaming rounded-xl px-6 py-4 text-lg text-right resize-none"
                        />
                      </motion.div>
                    </div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 flex gap-4">
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowCreateForm(false)} className="btn-ghost px-8 py-4 rounded-xl font-semibold text-lg">
                        إلغاء
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCreateRequest}
                        disabled={isSubmitting || !formData.gameId || !formData.title || !formData.description}
                        className={`flex-1 py-4 rounded-xl font-bold text-xl flex items-center justify-center gap-3 transition-all ${
                          isSubmitting || !formData.gameId || !formData.title || !formData.description
                            ? 'bg-ink-800/50 text-cream-muted/50 cursor-not-allowed'
                            : 'btn-primary glow-blue'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                              <Target className="w-6 h-6" />
                            </motion.div>
                            جاري النشر...
                          </>
                        ) : (
                          <>
                            <Send className="w-6 h-6" />
                            نشر الطلب
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold flex items-center gap-3 text-cream">
              <Gamepad2 className="w-8 h-8 text-blue-400" />
              اختر اللعبة
            </h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowFilters(!showFilters)} className="btn-ghost flex items-center gap-2 px-6 py-3 rounded-xl">
              <Filter className="w-5 h-5" />
              {showFilters ? 'إخفاء الفلاتر' : 'إظهار الفلاتر'}
            </motion.button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {popularGames.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGame(game.name === selectedGame ? null : game.name)}
                className="cursor-pointer"
              >
                <GamingCard hover glow={selectedGame === game.name} className={`p-6 text-center relative overflow-hidden ${selectedGame === game.name ? 'neon-border-blue' : ''}`}>
                  <motion.div className={`absolute inset-0 bg-gradient-to-br ${game.color} ${selectedGame === game.name ? 'opacity-20' : 'opacity-0'} transition-opacity`} />
                  <div className="text-4xl mb-3 relative">{game.icon}</div>
                  <h3 className="text-sm font-bold mb-2 relative text-cream">{game.name}</h3>
                  <Badge variant="info" className="text-xs">
                    <Users className="w-3 h-3 ml-1" />
                    {game.players}
                  </Badge>
                </GamingCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <GamingCard className="p-8 mb-12 glass">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-cream">
                      <Globe className="w-6 h-6 text-blue-400" />
                      المنصة
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {platforms.map((platform, index) => (
                        <motion.button
                          key={platform.name}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => togglePlatform(platform.name)}
                          className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all ${
                            selectedPlatforms.includes(platform.name)
                              ? `bg-gradient-to-r ${platform.color} text-cream glow-blue`
                              : 'btn-ghost'
                          }`}
                        >
                          <span className="text-xl">{platform.icon}</span>
                          {platform.name}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-cream">
                      <Target className="w-6 h-6 text-amber-400" />
                      نوع النشاط
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
                          className={`p-6 rounded-2xl border transition-all ${
                            selectedActivities.includes(activity.name)
                              ? `border-neon-blue/50 bg-gradient-to-br ${activity.bg}`
                              : 'border-neon-blue/15 bg-ink-900/40 hover:border-neon-blue/30'
                          }`}
                        >
                          <activity.icon className={`w-8 h-8 ${activity.color} mx-auto mb-3`} />
                          <p className="font-bold text-cream">{activity.name}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-2 text-cream">
                      <Users className="w-6 h-6 text-emerald-400" />
                      حجم الفريق
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
                          onClick={() => setSelectedTeamSize(size === selectedTeamSize ? null : size)}
                          className={`w-20 h-20 rounded-2xl font-bold text-lg transition-all ${
                            selectedTeamSize === size
                              ? 'bg-gradient-to-br from-emerald-600 to-emerald-400 text-cream glow-blue'
                              : 'btn-ghost'
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setVoiceOnly(!voiceOnly)} className={`w-full p-6 rounded-2xl border transition-all flex items-center justify-center gap-4 ${voiceOnly ? 'border-neon-blue/50 bg-neon-blue/10' : 'border-neon-blue/15 bg-ink-900/40 hover:border-neon-blue/30'}`}>
                      {voiceOnly ? <Mic className="w-6 h-6 text-blue-400" /> : <MicOff className="w-6 h-6 text-cream-muted" />}
                      <span className="text-xl font-bold text-cream">مطلوب دردشة صوتية</span>
                    </motion.button>
                  </div>

                  <div className="flex justify-end">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={clearFilters} className="btn-ghost px-8 py-3 rounded-xl font-semibold">
                      مسح جميع الفلاتر
                    </motion.button>
                  </div>
                </div>
              </GamingCard>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold flex items-center gap-3 text-cream">
            <Users className="w-8 h-8 text-blue-400" />
            اللاعبون المتاحون
          </h2>
          <Badge variant="success" className="text-lg px-6 py-2">
            <Zap className="w-5 h-5 ml-2" />
            {playRequests.length} طلب نشط
          </Badge>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="surface rounded-xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 skeleton-shimmer rounded-2xl" />
                  <div className="flex-1">
                    <div className="h-6 w-32 skeleton-shimmer rounded mb-2" />
                    <div className="h-4 w-20 skeleton-shimmer rounded" />
                  </div>
                </div>
                <div className="h-4 skeleton-shimmer rounded mb-3" />
                <div className="h-4 w-3/4 skeleton-shimmer rounded mb-6" />
                <div className="h-12 skeleton-shimmer rounded-xl" />
              </div>
            ))}
          </div>
        ) : playRequests.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-20 h-20 text-cream-muted/30 mx-auto mb-4" />
            <p className="text-2xl text-cream-muted">لا توجد طلبات لعب نشطة حالياً</p>
            <p className="text-cream-muted/60 mt-2">كن أول من ينشئ طلباً!</p>
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
                <GamingCard hover glow className="p-8 relative overflow-hidden group h-full">
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                          <h3 className="text-2xl font-bold mb-1 text-right text-cream">
                            {playRequest.user.name}
                          </h3>
                        </div>
                        <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-red-deep rounded-2xl flex items-center justify-center text-3xl neon-border-blue">
                          {playRequest.user.avatar ?? '🎮'}
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
                        {playRequest.participants.length} / {playRequest.playersNeeded}
                      </Badge>
                    </div>

                    <p className="text-cream-muted mb-6 leading-relaxed text-right">
                      {playRequest.description}
                    </p>

                    <div className="flex gap-3">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <GamingButton variant="ghost">
                          <MessageCircle className="w-4 h-4" />
                        </GamingButton>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                        <GamingButton variant="primary" className="w-full" glow>
                          <Users className="w-4 h-4 ml-2" />
                          انضم للطلب
                        </GamingButton>
                      </motion.div>
                    </div>
                  </div>
                </GamingCard>
              </motion.div>
            ))}
          </div>
        )}

        {playRequests.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-12 text-center">
            <GamingButton variant="primary" size="lg">
              تحميل المزيد من اللاعبين
            </GamingButton>
          </motion.div>
        )}
      </div>
    </div>
  );
}
