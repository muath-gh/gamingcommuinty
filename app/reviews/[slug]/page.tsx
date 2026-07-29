'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Eye, Heart, User, Calendar, ChevronRight, Gamepad2, Share2, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GamingButton } from '@/components/gaming/GamingButton';
import { Badge } from '@/components/gaming/Badge';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ReviewDetailPage({ params }: { params: { slug: string } }) {
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchReview();
  }, [params.slug]);

  const fetchReview = async () => {
    const { data, error } = await supabase
      .from('game_reviews')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (data) {
      setReview(data);
      await supabase
        .from('game_reviews')
        .update({ views_count: data.views_count + 1 })
        .eq('id', data.id);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (!review || liked) return;
    setLiked(true);
    await supabase
      .from('game_reviews')
      .update({ likes_count: review.likes_count + 1 })
      .eq('id', review.id);
    setReview({ ...review, likes_count: review.likes_count + 1 });
  };

  if (loading) {
    return (
      <div className="min-h-screen ambient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-cream-muted">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen ambient-bg flex items-center justify-center">
        <div className="text-center">
          <Gamepad2 className="w-20 h-20 text-cream-muted/30 mx-auto mb-4" />
          <p className="text-2xl text-cream-muted mb-4">المراجعة غير موجودة</p>
          <Link href="/reviews">
            <GamingButton variant="primary">العودة إلى المراجعات</GamingButton>
          </Link>
        </div>
      </div>
    );
  }

  const ratingCategories = [
    { label: 'الرسومات', score: review.graphics_score || 9 },
    { label: 'القصة', score: review.story_score || 8 },
    { label: 'اللعب', score: review.gameplay_score || 9 },
    { label: 'الصوت', score: review.sound_score || 8 },
    { label: 'إعادة اللعب', score: review.replayability_score || 7 },
  ];

  return (
    <div className="min-h-screen ambient-bg text-cream">
      <div className="relative h-[60vh] overflow-hidden">
        <img src={review.cover_image} alt={review.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-2 mb-4 text-cream-muted">
                <Link href="/" className="hover:text-cream transition-colors">الرئيسية</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/reviews" className="hover:text-cream transition-colors">المراجعات</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-cream">{review.game_name}</span>
              </div>

              <div className="flex items-start gap-6">
                <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring' }} className="glass-strong rounded-2xl p-6 neon-border-blue">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <Star className="w-8 h-8 text-amber-400" fill="currentColor" />
                    </div>
                    <div className="text-5xl font-black text-amber-400 text-glow-blue">{review.rating}</div>
                    <div className="text-xs text-cream-muted mt-1">من 10</div>
                  </div>
                </motion.div>

                <div className="flex-1">
                  <Badge variant="info" className="mb-3">
                    <Gamepad2 className="w-3 h-3 ml-1" />
                    {review.genre}
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-black mb-3 text-right text-cream">{review.title}</h1>
                  <p className="text-lg text-cream-muted mb-4 text-right">{review.excerpt}</p>
                  <div className="flex items-center gap-6 flex-wrap text-sm text-cream-muted">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{review.author_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{review.views_count} مشاهدة</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <GamingCard className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-cream">المراجعة الكاملة</h2>
                <div className="text-lg leading-relaxed text-cream-muted whitespace-pre-wrap text-right">
                  {review.content}
                </div>
              </GamingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <GamingCard className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-cream">التقييم التفصيلي</h2>
                <div className="space-y-4">
                  {ratingCategories.map((cat, index) => (
                    <motion.div key={cat.label} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }} className="flex items-center gap-4">
                      <span className="w-24 text-cream-muted text-left">{cat.label}</span>
                      <div className="flex-1 h-3 bg-ink-900/80 rounded-full overflow-hidden border border-neon-blue/10">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${cat.score * 10}%` }} transition={{ delay: 0.3 + 0.1 * index, duration: 0.8 }} className={`h-full rounded-full ${cat.score >= 8 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : cat.score >= 6 ? 'bg-gradient-to-r from-amber-500 to-amber-300' : 'bg-gradient-to-r from-neon-red to-red-400'}`} />
                      </div>
                      <span className="w-8 text-center font-bold text-cream">{cat.score}</span>
                    </motion.div>
                  ))}
                </div>
              </GamingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <GamingCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <MessageCircle className="w-6 h-6 text-blue-400" />
                  <h2 className="text-2xl font-bold text-cream">التعليقات</h2>
                </div>
                <div className="flex gap-3 mb-6">
                  <input type="text" placeholder="اكتب تعليقك..." className="flex-1 input-gaming rounded-xl px-5 py-3" />
                  <GamingButton variant="primary">إرسال</GamingButton>
                </div>
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-cream-muted/30 mx-auto mb-2" />
                  <p className="text-cream-muted">كن أول من يعلق على هذه المراجعة</p>
                </div>
              </GamingCard>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <GamingCard className="p-6">
                <div className="space-y-4">
                  <p className="text-sm text-cream-muted text-center mb-4">هل أعجبتك المراجعة؟</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <GamingButton variant={liked ? "success" : "accent"} className="w-full" glow={!liked} onClick={handleLike} disabled={liked}>
                      <Heart className={`w-5 h-5 ml-2 ${liked ? 'fill-current' : ''}`} />
                      {liked ? 'تم الإعجاب' : 'أعجبني'} ({review.likes_count})
                    </GamingButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <GamingButton variant="ghost" className="w-full">
                      <Share2 className="w-5 h-5 ml-2" />
                      مشاركة
                    </GamingButton>
                  </motion.div>
                </div>
              </GamingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <GamingCard className="p-6">
                <h3 className="text-xl font-bold mb-4 text-cream">معلومات اللعبة</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-cream-muted">المنصات</span>
                    <div className="flex gap-1">
                      {review.platforms?.map((p: string) => (
                        <Badge key={p} variant="default" size="sm">{p}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-muted">التصنيف</span>
                    <span className="text-cream">{review.genre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream-muted">المراجع</span>
                    <span className="text-cream">{review.author_name}</span>
                  </div>
                </div>
              </GamingCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
              <Link href="/reviews">
                <GamingButton variant="ghost" className="w-full">عرض جميع المراجعات</GamingButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
