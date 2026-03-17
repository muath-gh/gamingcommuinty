'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, User, Eye, Heart, ChevronRight, Tag, Share2, Newspaper } from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { GamingButton } from '@/components/gaming/GamingButton';
import { Badge } from '@/components/gaming/Badge';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface News {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_avatar: string;
  category: string;
  tags: string[];
  views_count: number;
  likes_count: number;
  is_featured: boolean;
  created_at: string;
}

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  const [news, setNews] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchNews();
  }, [params.slug]);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('game_news')
      .select('*')
      .eq('slug', params.slug)
      .single();

    if (data) {
      setNews(data);

      await supabase
        .from('game_news')
        .update({ views_count: data.views_count + 1 })
        .eq('id', data.id);

      const { data: related } = await supabase
        .from('game_news')
        .select('*')
        .eq('published', true)
        .neq('id', data.id)
        .limit(3);

      if (related) setRelatedNews(related);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    if (!news || liked) return;

    setLiked(true);
    await supabase
      .from('game_news')
      .update({ likes_count: news.likes_count + 1 })
      .eq('id', news.id);

    setNews({ ...news, likes_count: news.likes_count + 1 });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 mx-auto mb-4" />
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-slate-400 mb-4">الخبر غير موجود</p>
          <Link href="/news">
            <GamingButton variant="primary">العودة إلى الأخبار</GamingButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="relative h-[70vh] overflow-hidden">
        <img
          src={news.cover_image}
          alt={news.title}
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
                <Link href="/news" className="hover:text-white transition-colors">الأخبار</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-white">{news.category}</span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <Badge variant="warning" glow>
                  {news.category}
                </Badge>
                {news.is_featured && (
                  <Badge variant="danger">
                    مميز
                  </Badge>
                )}
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-4 text-right">
                {news.title}
              </h1>

              <p className="text-xl text-slate-300 mb-6 max-w-3xl text-right">
                {news.excerpt}
              </p>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{news.author_name}</p>
                    <p className="text-sm text-slate-400">المحرر</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-5 h-5" />
                  <span>{new Date(news.created_at).toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <Eye className="w-5 h-5" />
                  <span>{news.views_count} مشاهدة</span>
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
                <div className="prose prose-invert prose-lg max-w-none">
                  <div className="text-lg leading-relaxed text-slate-300 whitespace-pre-wrap text-right">
                    {news.content}
                  </div>
                </div>
              </GamingCard>

              {news.tags && news.tags.length > 0 && (
                <GamingCard className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Tag className="w-5 h-5 text-blue-400" />
                    <h3 className="text-xl font-bold">الوسوم</h3>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-end">
                    {news.tags.map((tag) => (
                      <Badge key={tag} variant="info">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </GamingCard>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <GamingCard className="p-6">
                <div className="text-center space-y-4">
                  <p className="text-sm text-slate-400 mb-4">هل أعجبك الخبر؟</p>
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
                      <span className="mr-2">({news.likes_count})</span>
                    </GamingButton>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <GamingButton variant="ghost" className="w-full">
                      <Share2 className="w-5 h-5 ml-2" />
                      مشاركة
                    </GamingButton>
                  </motion.div>
                </div>
              </GamingCard>
            </motion.div>

            {relatedNews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GamingCard className="p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Newspaper className="w-5 h-5 text-blue-400" />
                    أخبار ذات صلة
                  </h3>
                  <div className="space-y-4">
                    {relatedNews.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <Link href={`/news/${item.slug}`}>
                          <div className="group cursor-pointer">
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                              <img
                                src={item.cover_image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                            </div>
                            <h4 className="font-bold line-clamp-2 group-hover:text-blue-400 transition-colors text-right">
                              {item.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 text-right">
                              {new Date(item.created_at).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </GamingCard>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/news">
                <GamingButton variant="ghost" className="w-full">
                  عرض جميع الأخبار
                </GamingButton>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
