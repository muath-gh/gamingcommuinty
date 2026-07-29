'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Star, Gamepad2, FileText, Image as ImageIcon, Tag, Loader as Loader2, CircleAlert as AlertCircle, X, CircleCheck as CheckCircle2, Send } from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GamingButton } from '@/components/gaming/GamingButton';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';

const genres = ['أكشن', 'مغامرات', 'رعب', 'لعب الأدوار', 'رياضة', 'سباقات', 'استراتيجية', 'محاكاة'];
const platforms = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile'];

export default function CreateReviewPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    gameName: '',
    genre: '',
    excerpt: '',
    content: '',
    coverImage: '',
    rating: 7,
    platforms: [] as string[],
    graphicsScore: 7,
    storyScore: 7,
    gameplayScore: 7,
    soundScore: 7,
    replayabilityScore: 7,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const togglePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim() || !formData.gameName.trim() || !formData.content.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('فشل إنشاء المراجعة');

      setSuccess('تم إنشاء المراجعة بنجاح!');
      setTimeout(() => router.push('/reviews'), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-bg text-cream">
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Badge variant="info" glow className="mb-4 inline-flex">
            <Star className="w-4 h-4 ml-2" />
            مراجعة جديدة
          </Badge>
          <h1 className="text-5xl font-black mb-4 text-cream">
            أنشئ <GlowText color="blue">مراجعة</GlowText>
          </h1>
          <p className="text-xl text-cream-muted">شارك رأيك في لعبة مع المجتمع</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="relative bg-neon-red/10 border border-neon-red/40 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-300">{error}</p>
                </div>
                <button onClick={() => setError('')} className="p-1 hover:bg-neon-red/20 rounded-lg transition-colors">
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 overflow-hidden">
              <div className="relative bg-emerald-600/10 border border-emerald-500/40 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <p className="text-emerald-300">{success}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <GamingCard className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-cream">
                  <Star className="w-4 h-4 text-blue-400" />
                  عنوان المراجعة *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="مثال: مراجعة شاملة للعبة..."
                  className="w-full input-gaming rounded-xl px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-cream">
                  <Gamepad2 className="w-4 h-4 text-blue-400" />
                  اسم اللعبة *
                </label>
                <input
                  type="text"
                  value={formData.gameName}
                  onChange={(e) => setFormData({ ...formData, gameName: e.target.value })}
                  placeholder="اسم اللعبة"
                  className="w-full input-gaming rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-cream">
                  <Tag className="w-4 h-4 text-blue-400" />
                  التصنيف
                </label>
                <select
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className="w-full input-gaming rounded-xl px-4 py-3"
                >
                  <option value="">اختر التصنيف</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-cream">
                  <ImageIcon className="w-4 h-4 text-blue-400" />
                  رابط صورة الغلاف
                </label>
                <input
                  type="text"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full input-gaming rounded-xl px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-cream">
                <FileText className="w-4 h-4 text-blue-400" />
                ملخص قصير
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="ملخص مختصر للمراجعة..."
                rows={2}
                className="w-full input-gaming rounded-xl px-4 py-3 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 flex items-center gap-2 text-cream">
                <FileText className="w-4 h-4 text-blue-400" />
                المراجعة الكاملة *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="اكتب مراجعتك الكاملة هنا..."
                rows={10}
                className="w-full input-gaming rounded-xl px-4 py-3 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-3 text-cream">المنصات</label>
              <div className="flex flex-wrap gap-3">
                {platforms.map(p => (
                  <motion.button
                    key={p}
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => togglePlatform(p)}
                    className={`px-5 py-2 rounded-lg font-semibold transition-all ${
                      formData.platforms.includes(p) ? 'btn-primary glow-blue' : 'btn-ghost'
                    }`}
                  >
                    {p}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: 'rating', label: 'التقييم العام', max: 10 },
                { key: 'graphicsScore', label: 'الرسومات', max: 10 },
                { key: 'storyScore', label: 'القصة', max: 10 },
                { key: 'gameplayScore', label: 'اللعب', max: 10 },
                { key: 'soundScore', label: 'الصوت', max: 10 },
                { key: 'replayabilityScore', label: 'إعادة اللعب', max: 10 },
              ].map(score => (
                <div key={score.key}>
                  <label className="block text-sm font-bold mb-2 text-cream">
                    {score.label}: <span className="text-blue-400 font-black">{(formData as any)[score.key]}</span> / {score.max}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max={score.max}
                    value={(formData as any)[score.key]}
                    onChange={(e) => setFormData({ ...formData, [score.key]: parseInt(e.target.value) })}
                    className="w-full accent-neon-blue"
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="flex-1 py-4 rounded-xl font-bold text-lg btn-primary glow-blue disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="flex items-center justify-center gap-2">
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  {loading ? 'جاري النشر...' : 'نشر المراجعة'}
                  {!loading && <Send className="w-5 h-5" />}
                </span>
              </motion.button>
            </div>
          </GamingCard>
        </motion.form>
      </div>
    </div>
  );
}
