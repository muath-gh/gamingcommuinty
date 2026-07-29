'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Heart, MessageCircle, Share2, Play, Image as ImageIcon, Video,
  TrendingUp, Eye, Bookmark, ArrowRight, X, ThumbsUp, Smile, Flame,
  Award, Send, ChevronLeft, ChevronRight, Plus,
} from 'lucide-react';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';
import UploadMediaDialog from '@/components/media/UploadMediaDialog';

const reactions = [
  { icon: ThumbsUp, label: 'إعجاب', color: 'text-blue-400' },
  { icon: Heart, label: 'حب', color: 'text-red-400' },
  { icon: Flame, label: 'نار', color: 'text-amber-400' },
  { icon: Award, label: 'رائع', color: 'text-amber-400' },
  { icon: Smile, label: 'مضحك', color: 'text-emerald-400' },
];

const mockComments = [
  { id: 1, author: 'عمر الجيمر', comment: 'لقطة رائعة! كيف حصلت عليها؟', time: 'منذ ساعة', avatar: 'ع' },
  { id: 2, author: 'سارة اللاعبة', comment: 'أفضل محتوى شفته اليوم', time: 'منذ ساعتين', avatar: 'س' },
  { id: 3, author: 'أحمد البطل', comment: 'ممتاز! هل يمكنك مشاركة الإعدادات؟', time: 'منذ 3 ساعات', avatar: 'أ' },
  { id: 4, author: 'ليلى المغامرة', comment: 'يستاهل كل الاحترام', time: 'منذ 4 ساعات', avatar: 'ل' },
  { id: 5, author: 'خالد البطل', comment: 'واو! هذا مذهل', time: 'منذ 5 ساعات', avatar: 'خ' },
];

export default function MediaGallery() {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [commentText, setCommentText] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    fetch('/api/media')
      .then((res) => res.json())
      .then((data) => {
        setGalleryItems(data.all);
        setTrendingItems(data.trending);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = galleryItems.filter((item) => filter === 'all' || item.type === filter);

  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const getCurrentItemIndex = () => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex((item) => item.id === selectedItem.id);
  };

  const navigateToNext = () => {
    const currentIndex = getCurrentItemIndex();
    if (currentIndex < filteredItems.length - 1) setSelectedItem(filteredItems[currentIndex + 1]);
  };

  const navigateToPrevious = () => {
    const currentIndex = getCurrentItemIndex();
    if (currentIndex > 0) setSelectedItem(filteredItems[currentIndex - 1]);
  };

  return (
    <div className="min-h-screen ambient-bg text-cream">
      <div className="fixed inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-neon-red/8 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />

      <div className="relative">
        <motion.div
          className="relative overflow-hidden border-b border-neon-blue/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800/20 to-ink-950" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <Link href="/">
              <motion.div
                className="inline-flex items-center text-cream-muted hover:text-cream transition-colors mb-8 cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </motion.div>
            </Link>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
                <Badge variant="danger" glow className="mb-6 inline-flex">
                  <ImageIcon className="w-4 h-4 ml-2" />
                  أكثر من 50 ألف صورة وفيديو
                </Badge>
              </motion.div>
              <motion.h1
                className="text-6xl md:text-7xl font-black mb-6 leading-tight text-cream"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <GlowText color="red">معرض الوسائط</GlowText> المجتمعي
              </motion.h1>
              <motion.p
                className="text-xl text-cream-muted mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                شارك أفضل لحظاتك في الألعاب واستمتع بمحتوى المجتمع
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row min-h-screen relative">
          <motion.div
            className={`${selectedItem ? 'lg:w-1/2' : 'w-full'} transition-all duration-500 px-6 py-16`}
            animate={{ width: selectedItem ? '50%' : '100%' }}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-4xl font-black text-cream">
                    المحتوى <GlowText color="red">الرائج</GlowText>
                  </h2>
                  <TrendingUp className="w-8 h-8 text-red-400 animate-pulse" />
                </div>

                {loading ? (
                  <div className={`grid grid-cols-1 ${selectedItem ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="surface rounded-xl overflow-hidden">
                        <div className="h-72 skeleton-shimmer" />
                        <div className="p-5">
                          <div className="h-6 w-3/4 skeleton-shimmer rounded mb-2" />
                          <div className="h-4 w-1/2 skeleton-shimmer rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 ${selectedItem ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 transition-all duration-500`}>
                    {trendingItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        whileHover={{ y: -10, scale: 1.02 }}
                        onClick={() => setSelectedItem(item)}
                      >
                        <GamingCard hover glow className="overflow-hidden group cursor-pointer">
                          <div className="relative h-72 overflow-hidden">
                            <motion.img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent" />
                            {item.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full glass-strong flex items-center justify-center neon-border-blue">
                                  <Play className="w-8 h-8 text-cream mr-1" fill="currentColor" />
                                </div>
                              </div>
                            )}
                            <div className="absolute top-4 right-4">
                              <Badge variant="danger" glow>
                                <TrendingUp className="w-3 h-3 ml-1" />
                                رائج
                              </Badge>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <div className="flex items-center gap-4 text-cream text-sm">
                                <div className="flex items-center gap-1">
                                  <Heart className="w-4 h-4" />
                                  <span>{item.likesCount.toLocaleString('ar-SA')}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{item.viewsCount.toLocaleString('ar-SA')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-5 surface">
                            <h3 className="text-xl font-bold mb-2 text-cream group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>
                            <div className="flex items-center justify-between text-sm text-cream-muted">
                              <span>{item.author?.name}</span>
                              <span>{item.game?.name}</span>
                            </div>
                          </div>
                        </GamingCard>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-4xl font-black text-cream">
                    جميع <GlowText color="blue">الوسائط</GlowText>
                  </h2>
                  <div className="flex gap-3">
                    {[
                      { value: 'all', label: 'الكل', icon: ImageIcon },
                      { value: 'image', label: 'صور', icon: ImageIcon },
                      { value: 'video', label: 'فيديوهات', icon: Video },
                    ].map(({ value, label, icon: Icon }) => (
                      <motion.button
                        key={value}
                        onClick={() => setFilter(value as typeof filter)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-lg font-bold transition-all ${
                          filter === value ? 'btn-primary glow-blue' : 'btn-ghost'
                        }`}
                      >
                        <Icon className="w-4 h-4 inline ml-2" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {loading ? (
                  <div className={`grid grid-cols-1 ${selectedItem ? 'md:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="surface rounded-xl overflow-hidden">
                        <div className="h-64 skeleton-shimmer" />
                        <div className="p-4">
                          <div className="h-5 w-3/4 skeleton-shimmer rounded mb-2" />
                          <div className="h-4 w-1/2 skeleton-shimmer rounded" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="text-center py-20">
                    <ImageIcon className="w-20 h-20 text-cream-muted/30 mx-auto mb-4" />
                    <p className="text-2xl text-cream-muted">لا يوجد محتوى</p>
                  </div>
                ) : (
                  <div className={`grid grid-cols-1 ${selectedItem ? 'md:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6 transition-all duration-500`}>
                    {filteredItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05, duration: 0.4 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => setSelectedItem(item)}
                      >
                        <GamingCard hover className="overflow-hidden group cursor-pointer">
                          <div className="relative h-64 overflow-hidden">
                            <motion.img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.5 }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />
                            {item.type === 'video' && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-14 h-14 rounded-full glass-strong flex items-center justify-center neon-border-blue">
                                  <Play className="w-7 h-7 text-cream mr-1" fill="currentColor" />
                                </div>
                              </div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={(e) => { e.stopPropagation(); toggleBookmark(item.id); }}
                                className={`p-2 rounded-lg glass-strong transition-colors ${bookmarked.has(item.id) ? 'text-amber-400' : 'text-cream hover:text-amber-400'}`}
                              >
                                <Bookmark className="w-4 h-4" fill={bookmarked.has(item.id) ? 'currentColor' : 'none'} />
                              </motion.button>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="flex items-center justify-between text-cream text-sm">
                                <div className="flex items-center gap-3">
                                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }} className="flex items-center gap-1">
                                    <Heart className={`w-4 h-4 transition-colors ${liked.has(item.id) ? 'text-red-400' : ''}`} fill={liked.has(item.id) ? 'currentColor' : 'none'} />
                                    <span>{(item.likesCount + (liked.has(item.id) ? 1 : 0)).toLocaleString('ar-SA')}</span>
                                  </motion.button>
                                  <div className="flex items-center gap-1">
                                    <MessageCircle className="w-4 h-4" />
                                    <span>{item.commentsCount.toLocaleString('ar-SA')}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{item.viewsCount.toLocaleString('ar-SA')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="text-lg font-bold mb-2 text-cream group-hover:text-blue-400 transition-colors line-clamp-2">{item.title}</h3>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-cream-muted">{item.author?.name}</span>
                              <Badge variant="info" className="text-xs">{item.game?.name}</Badge>
                            </div>
                          </div>
                        </GamingCard>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedItem && (
              <motion.div
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed lg:sticky top-0 right-0 w-full lg:w-1/2 h-screen glass-strong border-r border-neon-blue/15 overflow-y-auto z-40"
              >
                <div className="relative h-full">
                  <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }} onClick={() => setSelectedItem(null)} className="absolute top-4 left-4 z-50 p-3 rounded-xl glass-strong text-cream hover:text-red-400 transition-all neon-border-blue">
                    <X className="w-6 h-6" />
                  </motion.button>

                  {getCurrentItemIndex() > 0 && (
                    <motion.button initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }} onClick={navigateToPrevious} className="absolute top-1/2 left-4 z-50 p-3 rounded-full glass-strong text-cream hover:text-blue-400 transition-all neon-border-blue">
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                  )}
                  {getCurrentItemIndex() < filteredItems.length - 1 && (
                    <motion.button initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} whileHover={{ scale: 1.1, x: 5 }} whileTap={{ scale: 0.9 }} onClick={navigateToNext} className="absolute top-1/2 right-4 z-50 p-3 rounded-full glass-strong text-cream hover:text-blue-400 transition-all neon-border-blue">
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  )}

                  <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }} className="relative h-[50vh] lg:h-[60vh] overflow-hidden bg-ink-950">
                    <motion.img key={selectedItem.id} initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }} src={selectedItem.url} alt={selectedItem.title} className="w-full h-full object-contain" />
                    {selectedItem.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full glass-strong flex items-center justify-center cursor-pointer neon-border-blue">
                          <Play className="w-10 h-10 text-cream mr-1" fill="currentColor" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-transparent pointer-events-none" />
                  </motion.div>

                  <div className="p-6 lg:p-8 space-y-6">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-3xl lg:text-4xl font-black mb-3 leading-tight text-cream">{selectedItem.title}</h2>
                          <div className="flex items-center gap-4 text-cream-muted">
                            <span className="text-lg">{selectedItem.author?.name}</span>
                            <span>•</span>
                            <Badge variant="info">{selectedItem.game?.name}</Badge>
                          </div>
                        </div>
                        <motion.button whileHover={{ scale: 1.1, rotate: 10 }} whileTap={{ scale: 0.9 }} className="p-3 rounded-xl glass-strong neon-border-blue text-cream hover:text-blue-400 transition-all">
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                        {reactions.map(({ icon: Icon, label, color }, index) => (
                          <motion.button
                            key={label}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: index * 0.05 + 0.3, type: 'spring' }}
                            whileHover={{ scale: 1.15, y: -5, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedReaction(selectedReaction === index ? null : index)}
                            className={`p-3 rounded-xl transition-all ${selectedReaction === index ? 'glass-strong neon-border-blue' : 'glass'}`}
                          >
                            <Icon className={`w-5 h-5 ${color}`} />
                          </motion.button>
                        ))}
                      </div>

                      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} className="grid grid-cols-3 gap-4 mb-6">
                        {[
                          { icon: Heart, value: selectedItem.likesCount, label: 'إعجاب', color: 'text-red-400' },
                          { icon: MessageCircle, value: selectedItem.commentsCount, label: 'تعليق', color: 'text-blue-400' },
                          { icon: Eye, value: selectedItem.viewsCount, label: 'مشاهدة', color: 'text-emerald-400' },
                        ].map(({ icon: Icon, value, label, color }, index) => (
                          <motion.div key={label} initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: index * 0.1 + 0.4, type: 'spring' }} whileHover={{ scale: 1.05, y: -3 }} className="p-4 rounded-xl surface text-center cursor-pointer surface-hover transition-all">
                            <div className={`flex items-center justify-center gap-2 ${color} mb-1`}>
                              <Icon className="w-5 h-5" />
                              <span className="text-2xl font-bold">{value.toLocaleString('ar-SA')}</span>
                            </div>
                            <p className="text-cream-muted text-sm">{label}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="border-t border-neon-blue/15 pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black flex items-center gap-2 text-cream">
                          <MessageCircle className="w-6 h-6 text-blue-400" />
                          التعليقات
                        </h3>
                        <Badge variant="info">{mockComments.length}</Badge>
                      </div>

                      <motion.div className="flex gap-3 mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
                        <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="اكتب تعليقك..." className="flex-1 input-gaming rounded-xl px-5 py-3" />
                        <button className="px-6 py-3 rounded-xl btn-primary glow-blue">
                          <Send className="w-5 h-5" />
                        </button>
                      </motion.div>

                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {mockComments.map((comment, index) => (
                          <motion.div key={comment.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 + 0.7 }} whileHover={{ x: 5, scale: 1.01 }} className="flex gap-3 p-4 rounded-xl surface surface-hover transition-all cursor-pointer">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-blue to-neon-red-deep flex items-center justify-center text-lg font-bold flex-shrink-0 neon-border-blue">
                              {comment.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-bold text-sm text-cream">{comment.author}</span>
                                <span className="text-cream-muted text-xs">{comment.time}</span>
                              </div>
                              <p className="text-cream-muted text-sm leading-relaxed">{comment.comment}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <button className="text-xs text-cream-muted hover:text-blue-400 transition-colors flex items-center gap-1">
                                  <Heart className="w-3 h-3" />
                                  إعجاب
                                </button>
                                <button className="text-xs text-cream-muted hover:text-blue-400 transition-colors">رد</button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.button
        onClick={() => setShowUploadModal(true)}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full btn-secondary text-cream flex items-center justify-center glow-red"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      <UploadMediaDialog showUploadModal={showUploadModal} setShowUploadModal={setShowUploadModal} />
    </div>
  );
}
