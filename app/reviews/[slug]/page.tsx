'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Eye, Heart, Calendar, User, Gamepad2, Monitor, ChevronRight, TrendingUp } from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GamingButton } from '@/components/gaming/GamingButton';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Review {
  id: string;
  title: string;
  game_name: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_avatar: string;
  rating: number;
  gameplay_rating: number;
  graphics_rating: number;
  story_rating: number;
  sound_rating: number;
  platforms: string[];
  genre: string;
  developer: string;
  release_date: string;
  views_count: number;
  likes_count: number;
  created_at: string;
}

export default function ReviewDetailPage({ params }: { params: { slug: string } }) {
  const [review, setReview] = useState<Review | null>(null);
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

  const ratingCategories = review ? [
    { name: 'اللعب', value: review.gameplay_rating, icon: Gamepad2 },
    { name: 'الرسومات', value: review.graphics_rating, icon: Monitor },
    { name: 'القصة', value: review.story_rating, icon: Star },
    { name: 'الصوت', value: review.sound_rating, icon: TrendingUp },
  ] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-purple-500 mx-auto mb-4" />
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-400 mb-4">المراجعة غير موجودة</p>
          <Link href="/reviews">
            <GamingButton variant="primary">العودة إلى المراجعات</GamingButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={review.cover_image}
          alt={review.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-6 pb-12 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-2 mb-4 text-slate-400">
                <Link href="/" className="hover:text-white transition-colors">الرئيسية</Link>
                <ChevronRight className="w-4 h-4" />
                <Link href="/reviews" className="hover:text-white transition-colors">المراجعات</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{review.game_name}</span>
              </div>

              <Badge variant="info" className="mb-4">
                <Gamepad2 className="w-4 h-4 ml-2" />
                {review.genre}
              </Badge>

              <h1 className="text-5xl md:text-7xl font-black mb-4 text-right">
                {review.title}
              </h1>

              <p className="text-xl text-slate-300 mb-6 max-w-3xl text-right">
                {review.excerpt}
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{review.author_name}</p>
                    <p className="text-sm text-slate-400">كاتب المراجعة</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(review.created_at).toLocaleDateString('ar-SA')}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Eye className="w-5 h-5" />
                  <span>{review.views_count} مشاهدة</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GamingCard className="p-8 mb-8">
                <div className="prose prose-invert max-w-none">
                  <div className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap text-right">
                    {review.content}
                  </div>
                </div>
              </GamingCard>

              <GamingCard className="p-8">
                <h2 className="text-3xl font-bold mb-6 text-right">التقييمات التفصيلية</h2>
                <div className="space-y-6">
                  {ratingCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex-1 text-right">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-lg font-bold text-purple-400">{category.value}/10</span>
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold">{category.name}</span>
                            <category.icon className="w-5 h-5 text-purple-400" />
                          </div>
                        </div>
                        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${category.value * 10}%` }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GamingCard>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GamingCard className="p-8 text-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-orange-500/10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative">
                  <p className="text-sm text-slate-400 mb-2">التقييم الإجمالي</p>
                  <div className="text-7xl font-black mb-4">
                    <GlowText color="pink">{review.rating}</GlowText>
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(review.rating / 2)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-lg text-slate-300">من 10</p>
                </div>
              </GamingCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GamingCard className="p-6">
                <h3 className="text-xl font-bold mb-4 text-right">معلومات اللعبة</h3>
                <div className="space-y-3 text-right">
                  <div>
                    <p className="text-sm text-slate-400 mb-1">المطور</p>
                    <p className="font-semibold">{review.developer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">تاريخ الإصدار</p>
                    <p className="font-semibold">{review.release_date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400 mb-1">المنصات</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-end">
                      {review.platforms.map((platform) => (
                        <Badge key={platform} variant="info">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </GamingCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GamingCard className="p-6">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-4">هل أعجبتك المراجعة؟</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GamingButton
                      variant={liked ? "success" : "accent"}
                      className="w-full"
                      glow={!liked}
                      onClick={handleLike}
                      disabled={liked}
                    >
                      <Heart className={`w-5 h-5 ml-2 ${liked ? 'fill-current' : ''}`} />
                      {liked ? 'تم الإعجاب' : 'أعجبني'}
                      <span className="mr-2">({review.likes_count})</span>
                    </GamingButton>
                  </motion.div>
                </div>
              </GamingCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link href="/reviews">
                <GamingButton variant="ghost" className="w-full">
                  عرض جميع المراجعات
                </GamingButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
