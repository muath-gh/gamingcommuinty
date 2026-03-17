'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Eye, Heart, Gamepad2, TrendingUp, Filter, Search, X } from 'lucide-react';
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
  author_name: string;
  rating: number;
  platforms: string[];
  genre: string;
  views_count: number;
  likes_count: number;
  created_at: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  const genres = ['أكشن', 'مغامرات', 'رعب', 'لعب الأدوار', 'رياضة', 'سباقات', 'استراتيجية'];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('game_reviews')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (data) {
      setReviews(data);
    }
    setLoading(false);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.game_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = !selectedGenre || review.genre.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-20 px-6">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress')] opacity-5 bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge variant="info" glow className="mb-6 inline-flex">
              <Star className="w-4 h-4 ml-2" />
              {reviews.length} مراجعة شاملة
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black mb-4">
              <GlowText color="purple">مراجعات</GlowText> الألعاب
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              تحليل متعمق لأحدث وأفضل الألعاب مع تقييمات شاملة
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
                placeholder="ابحث عن مراجعة أو لعبة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl pr-16 pl-6 py-5 text-lg focus:outline-none focus:border-purple-500 transition-all text-right"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery('')}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-6 h-6 text-purple-400" />
            <h2 className="text-2xl font-bold">التصنيفات</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedGenre(null)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                !selectedGenre
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              الكل
            </motion.button>
            {genres.map((genre, index) => (
              <motion.button
                key={genre}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGenre(genre)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedGenre === genre
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {genre}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <GamingCard className="p-6">
                  <div className="aspect-video bg-slate-700 rounded-lg mb-4" />
                  <div className="h-6 bg-slate-700 rounded mb-2" />
                  <div className="h-4 bg-slate-700 rounded w-2/3" />
                </GamingCard>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <Link href={`/reviews/${review.slug}`}>
                  <GamingCard hover glow className="p-0 overflow-hidden h-full cursor-pointer group">
                    <div className="relative aspect-video overflow-hidden">
                      <img
                        src={review.cover_image}
                        alt={review.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

                      <div className="absolute top-4 right-4">
                        <div className="flex items-center gap-2 bg-yellow-500/90 backdrop-blur-sm px-4 py-2 rounded-full">
                          <Star className="w-5 h-5 fill-white text-white" />
                          <span className="font-black text-white text-lg">{review.rating}</span>
                        </div>
                      </div>

                      <div className="absolute bottom-4 right-4 left-4">
                        <Badge variant="info" className="mb-2">
                          <Gamepad2 className="w-3 h-3 ml-1" />
                          {review.game_name}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-purple-400 transition-colors text-right">
                        {review.title}
                      </h3>

                      <p className="text-slate-400 text-sm mb-4 line-clamp-2 text-right">
                        {review.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-800 pt-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            <span>{review.likes_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{review.views_count}</span>
                          </div>
                        </div>
                        <span className="text-slate-400">{review.author_name}</span>
                      </div>
                    </div>
                  </GamingCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {!loading && filteredReviews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Gamepad2 className="w-20 h-20 text-slate-700 mx-auto mb-4" />
            <p className="text-2xl text-slate-500">لم يتم العثور على مراجعات</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
