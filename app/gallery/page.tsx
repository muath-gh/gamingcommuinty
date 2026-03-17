'use client';

import React, { useState, useCallback ,useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useDropzone } from 'react-dropzone';
import {
  Heart,
  MessageCircle,
  Share2,
  Play,
  Image as ImageIcon,
  Video,
  TrendingUp,
  Eye,
  Bookmark,
  ArrowRight,
  X,
  ThumbsUp,
  Smile,
  Flame,
  Award,
  Send,
  ChevronLeft,
  ChevronRight,
  Upload,
  Plus,
  Sparkles,
  Tag,
  Check,
  Zap,
} from 'lucide-react';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UploadMediaDialog from '@/components/media/UploadMediaDialog';

interface UploadedFile {
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
}







const reactions = [
  { icon: ThumbsUp, label: 'إعجاب', color: 'text-blue-400' },
  { icon: Heart, label: 'حب', color: 'text-red-400' },
  { icon: Flame, label: 'نار', color: 'text-orange-400' },
  { icon: Award, label: 'رائع', color: 'text-yellow-400' },
  { icon: Smile, label: 'مضحك', color: 'text-green-400' },
];

const mockComments = [
  {
    id: 1,
    author: 'عمر الجيمر',
    comment: 'لقطة رائعة! كيف حصلت عليها؟',
    time: 'منذ ساعة',
    avatar: 'ع',
  },
  {
    id: 2,
    author: 'سارة اللاعبة',
    comment: 'أفضل محتوى شفته اليوم',
    time: 'منذ ساعتين',
    avatar: 'س',
  },
  {
    id: 3,
    author: 'أحمد البطل',
    comment: 'ممتاز! هل يمكنك مشاركة الإعدادات؟',
    time: 'منذ 3 ساعات',
    avatar: 'أ',
  },
  {
    id: 4,
    author: 'ليلى المغامرة',
    comment: 'يستاهل كل الاحترام',
    time: 'منذ 4 ساعات',
    avatar: 'ل',
  },
  {
    id: 5,
    author: 'خالد البطل',
    comment: 'واو! هذا مذهل',
    time: 'منذ 5 ساعات',
    avatar: 'خ',
  },
];

export default function MediaGallery() {

  const [galleryItems, setGalleryItems] = useState<any[]>([])
const [trendingItems, setTrendingItems] = useState<any[]>([])
const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [commentText, setCommentText] = useState('');
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
useEffect(() => {
  fetch('/api/media')
    .then(res => res.json())
    .then(data => {
      setGalleryItems(data.all)
      setTrendingItems(data.trending)
    })
    .finally(() => setLoading(false))
}, [])
  const filteredItems = galleryItems.filter(
    (item) => filter === 'all' || item.type === filter
  );


  const toggleLike = (id: number) => {
    setLiked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getCurrentItemIndex = () => {
    if (!selectedItem) return -1;
    return filteredItems.findIndex((item) => item.id === selectedItem.id);
  };

  const navigateToNext = () => {
    const currentIndex = getCurrentItemIndex();
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  };

  const navigateToPrevious = () => {
    const currentIndex = getCurrentItemIndex();
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    newFiles.forEach((uploadedFile) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setFiles((prev) =>
          prev.map((f) =>
            f.preview === uploadedFile.preview ? { ...f, progress } : f
          )
        );

        if (progress >= 100) {
          clearInterval(interval);
          setFiles((prev) =>
            prev.map((f) =>
              f.preview === uploadedFile.preview ? { ...f, uploaded: true } : f
            )
          );
          toast.success('File uploaded successfully!', {
            description: uploadedFile.file.name,
          });
        }
      }, 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept:
      mediaType === 'image'
        ? { 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }
        : { 'video/*': ['.mp4', '.webm'] },
    maxSize: mediaType === 'image' ? 10 * 1024 * 1024 : 100 * 1024 * 1024,
  });

  const removeFile = (preview: string) => {
    setFiles((prev) => prev.filter((f) => f.preview !== preview));
    URL.revokeObjectURL(preview);
    toast.info('File removed');
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (files.length === 0) {
      toast.error('Please upload at least one file');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Media uploaded successfully!', {
        description: 'Your content is now live in the gallery',
      });
      setShowUploadModal(false);
      setFiles([]);
      setTitle('');
      setDescription('');
      setSelectedGame('');
      setSelectedTags([]);
      setFeatured(false);
    }, 2000);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimatedParticles />

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(236,72,153,0.08)_0%,_transparent_50%)]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-pink-900/20 to-slate-900 border-b border-slate-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress')] opacity-5 bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative max-w-7xl mx-auto px-6 py-20">
            <Link href="/">
              <motion.div
                className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 cursor-pointer"
                whileHover={{ x: 5 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
                العودة للرئيسية
              </motion.div>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Badge variant="danger" glow className="mb-6 inline-flex">
                  <ImageIcon className="w-4 h-4 ml-2" />
                  أكثر من 50 ألف صورة وفيديو
                </Badge>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <GlowText color="pink">معرض الوسائط</GlowText> المجتمعي
              </motion.h1>

              <motion.p
                className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                شارك أفضل لحظاتك في الألعاب واستمتع بمحتوى المجتمع
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row min-h-screen">
          <motion.div
            className={`${
              selectedItem ? 'lg:w-1/2' : 'w-full'
            } transition-all duration-500 px-6 py-16`}
            animate={{
              width: selectedItem ? '50%' : '100%',
            }}
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
                  <h2 className="text-4xl font-black">
                    المحتوى <GlowText color="pink">الرائج</GlowText>
                  </h2>
                  <TrendingUp className="w-8 h-8 text-pink-400 animate-pulse" />
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    selectedItem ? 'md:grid-cols-2' : 'md:grid-cols-3'
                  } gap-6 transition-all duration-500`}
                >
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
                      <GamingCard
                        hover
                        glow
                        className="overflow-hidden group cursor-pointer"
                      >
                        <div className="relative h-72 overflow-hidden">
                          <motion.img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                          {item.type === 'video' && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center"
                              whileHover={{ scale: 1.1 }}
                            >
                              <motion.div
                                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                whileHover={{
                                  backgroundColor: 'rgba(255,255,255,0.3)',
                                }}
                              >
                                <Play
                                  className="w-8 h-8 text-white mr-1"
                                  fill="white"
                                />
                              </motion.div>
                            </motion.div>
                          )}

                          <div className="absolute top-4 right-4">
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + 0.3 }}
                            >
                              <Badge variant="danger" glow>
                                <TrendingUp className="w-3 h-3 ml-1" />
                                رائج
                              </Badge>
                            </motion.div>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center gap-4 text-white text-sm">
                              <motion.div
                                className="flex items-center gap-1"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Heart className="w-4 h-4" />
                                <span>{item.likesCount.toLocaleString('ar-SA')}</span>
                              </motion.div>
                              <motion.div
                                className="flex items-center gap-1"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Eye className="w-4 h-4" />
                                <span>{item.viewsCount.toLocaleString('ar-SA')}</span>
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 bg-gradient-to-br from-slate-900/95 to-slate-800/95">
                          <h3 className="text-xl font-bold mb-2 text-white group-hover:text-pink-400 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-slate-400">
                            <span>{item.author?.name}</span>
                            <span>{item.game?.name}</span>
                          </div>
                        </div>
                      </GamingCard>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                  <h2 className="text-4xl font-black">
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
                          filter === value
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30'
                            : 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Icon className="w-4 h-4 inline ml-2" />
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 ${
                    selectedItem
                      ? 'md:grid-cols-1 lg:grid-cols-2'
                      : 'md:grid-cols-2 lg:grid-cols-3'
                  } gap-6 transition-all duration-500`}
                >
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
                      <GamingCard
                        hover
                        className="overflow-hidden group cursor-pointer"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <motion.img
                            src={item.thumbnail}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />

                          {item.type === 'video' && (
                            <motion.div
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              whileHover={{ scale: 1.1 }}
                            >
                              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <Play
                                  className="w-7 h-7 text-white mr-1"
                                  fill="white"
                                />
                              </div>
                            </motion.div>
                          )}

                          <div className="absolute top-3 right-3 flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(item.id);
                              }}
                              className={`p-2 rounded-lg backdrop-blur-sm transition-colors ${
                                bookmarked.has(item.id)
                                  ? 'bg-yellow-500/30 text-yellow-400'
                                  : 'bg-black/30 text-white hover:bg-black/50'
                              }`}
                            >
                              <Bookmark
                                className="w-4 h-4"
                                fill={
                                  bookmarked.has(item.id) ? 'currentColor' : 'none'
                                }
                              />
                            </motion.button>
                          </div>

                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="flex items-center justify-between text-white text-sm">
                              <div className="flex items-center gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleLike(item.id);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <Heart
                                    className={`w-4 h-4 transition-colors ${
                                      liked.has(item.id) ? 'text-red-400' : ''
                                    }`}
                                    fill={liked.has(item.id) ? 'currentColor' : 'none'}
                                  />
                                  <span>
                                    {(
                                      item.likesCount + (liked.has(item.id) ? 1 : 0)
                                    ).toLocaleString('ar-SA')}
                                  </span>
                                </motion.button>
                                <motion.div
                                  className="flex items-center gap-1"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <MessageCircle className="w-4 h-4" />
                                  <span>
                                    {item.commentsCount.toLocaleString('ar-SA')}
                                  </span>
                                </motion.div>
                              </div>
                              <motion.div
                                className="flex items-center gap-1"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Eye className="w-4 h-4" />
                                <span>{item.viewsCount.toLocaleString('ar-SA')}</span>
                              </motion.div>
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">{item.author?.name}</span>
                            <Badge variant="info" className="text-xs">
                              {item.game?.name}
                            </Badge>
                          </div>
                        </div>
                      </GamingCard>
                    </motion.div>
                  ))}
                </div>
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
                className="fixed lg:sticky top-0 right-0 w-full lg:w-1/2 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 overflow-y-auto z-40"
              >
                <div className="relative h-full">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(null)}
                    className="absolute top-4 left-4 z-50 p-3 rounded-xl bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700 transition-all shadow-lg"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>

                  {getCurrentItemIndex() > 0 && (
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.1, x: -5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={navigateToPrevious}
                      className="absolute top-1/2 left-4 z-50 p-3 rounded-full bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700 transition-all shadow-lg"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </motion.button>
                  )}

                  {getCurrentItemIndex() < filteredItems.length - 1 && (
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={navigateToNext}
                      className="absolute top-1/2 right-4 z-50 p-3 rounded-full bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700 transition-all shadow-lg"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </motion.button>
                  )}

                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="relative h-[50vh] lg:h-[60vh] overflow-hidden bg-slate-950"
                  >
                    <motion.img
                      key={selectedItem.id}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      src={selectedItem.url}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain"
                    />
                    {selectedItem.type === 'video' && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer shadow-2xl"
                        >
                          <Play
                            className="w-10 h-10 text-white mr-1"
                            fill="white"
                          />
                        </motion.div>
                      </motion.div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                  </motion.div>

                  <div className="p-6 lg:p-8 space-y-6">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h2 className="text-3xl lg:text-4xl font-black mb-3 leading-tight">
                            {selectedItem.title}
                          </h2>
                          <div className="flex items-center gap-4 text-slate-400">
                            <span className="text-lg">{selectedItem.author?.name}</span>
                            <span>•</span>
                            <Badge variant="info">{selectedItem.game?.name}</Badge>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 transition-all shadow-lg"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                        {reactions.map(({ icon: Icon, label, color }, index) => (
                          <motion.button
                            key={label}
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                              delay: index * 0.05 + 0.3,
                              type: 'spring',
                            }}
                            whileHover={{ scale: 1.15, y: -5, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() =>
                              setSelectedReaction(
                                selectedReaction === index ? null : index
                              )
                            }
                            className={`p-3 rounded-xl transition-all group ${
                              selectedReaction === index
                                ? 'bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg'
                                : 'bg-slate-800 hover:bg-slate-700'
                            }`}
                          >
                            <Icon
                              className={`w-5 h-5 ${color} group-hover:scale-110 transition-transform`}
                            />
                          </motion.button>
                        ))}
                      </div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="grid grid-cols-3 gap-4 mb-6"
                      >
                        {[
                          {
                            icon: Heart,
                            value: selectedItem.likesCount,
                            label: 'إعجاب',
                            color: 'red',
                          },
                          {
                            icon: MessageCircle,
                            value: selectedItem.commentsCount,
                            label: 'تعليق',
                            color: 'cyan',
                          },
                          {
                            icon: Eye,
                            value: selectedItem.viewsCount,
                            label: 'مشاهدة',
                            color: 'green',
                          },
                        ].map(({ icon: Icon, value, label, color }, index) => (
                          <motion.div
                            key={label}
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{
                              delay: index * 0.1 + 0.4,
                              type: 'spring',
                            }}
                            whileHover={{ scale: 1.05, y: -3 }}
                            className="p-4 rounded-xl bg-slate-800/50 text-center cursor-pointer hover:bg-slate-800 transition-all"
                          >
                            <div
                              className={`flex items-center justify-center gap-2 text-${color}-400 mb-1`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-2xl font-bold">
                                {value.toLocaleString('ar-SA')}
                              </span>
                            </div>
                            <p className="text-slate-400 text-sm">{label}</p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="border-t border-slate-800 pt-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-black flex items-center gap-2">
                          <MessageCircle className="w-6 h-6 text-cyan-400" />
                          التعليقات
                        </h3>
                        <Badge variant="info">{mockComments.length}</Badge>
                      </div>

                      <motion.div
                        className="flex gap-3 mb-6"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="اكتب تعليقك..."
                          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                          whileFocus={{ scale: 1.02 }}
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </motion.button>
                      </motion.div>

                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                        {mockComments.map((comment, index) => (
                          <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 + 0.7 }}
                            whileHover={{ x: 5, scale: 1.01 }}
                            className="flex gap-3 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all cursor-pointer"
                          >
                            <motion.div
                              className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              {comment.avatar}
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="font-bold text-sm">
                                  {comment.author}
                                </span>
                                <span className="text-slate-500 text-xs">
                                  {comment.time}
                                </span>
                              </div>
                              <p className="text-slate-300 text-sm leading-relaxed">
                                {comment.comment}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
                                >
                                  <Heart className="w-3 h-3" />
                                  إعجاب
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors"
                                >
                                  رد
                                </motion.button>
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
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white shadow-2xl flex items-center justify-center"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: [
            '0 0 20px rgba(6, 182, 212, 0.5)',
            '0 0 40px rgba(168, 85, 247, 0.5)',
            '0 0 20px rgba(236, 72, 153, 0.5)',
            '0 0 40px rgba(6, 182, 212, 0.5)',
          ],
        }}
        transition={{
          boxShadow: {
            duration: 3,
            repeat: Infinity,
          },
        }}
      >
        <Plus className="w-8 h-8" />
      </motion.button>

      {/* <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-slate-700 shadow-2xl"
            >
              <div className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-700 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Sparkles className="w-8 h-8 text-cyan-400" />
                    </motion.div>
                    <div>
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Upload Media
                      </h2>
                      <p className="text-slate-400 text-sm mt-1">
                        Share your epic gaming moments
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowUploadModal(false)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <GamingCard className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <Label className="text-lg font-semibold text-white">
                          Media Type
                        </Label>
                        <div className="flex gap-2">
                          {(['image', 'video'] as const).map((type) => (
                            <motion.button
                              key={type}
                              onClick={() => setMediaType(type)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                                mediaType === type
                                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/50'
                                  : 'bg-slate-800 text-slate-400 hover:text-white'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {type === 'image' ? (
                                <ImageIcon className="w-4 h-4" />
                              ) : (
                                <Video className="w-4 h-4" />
                              )}
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div
                        {...getRootProps()}
                        className={`relative border-2 border-dashed rounded-xl p-12 transition-all cursor-pointer ${
                          isDragActive
                            ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                            : 'border-slate-700 hover:border-purple-400 bg-slate-800/50'
                        }`}
                        style={{
                          boxShadow: isDragActive
                            ? '0 0 30px rgba(6, 182, 212, 0.3)'
                            : '0 0 0px rgba(6, 182, 212, 0)',
                        }}
                      >
                        <input {...getInputProps()} />
                        <div className="flex flex-col items-center justify-center text-center">
                          <motion.div
                            animate={{
                              y: isDragActive ? -10 : 0,
                              scale: isDragActive ? 1.2 : 1,
                            }}
                            className="mb-4"
                          >
                            <Upload
                              className={`w-16 h-16 ${
                                isDragActive ? 'text-cyan-400' : 'text-slate-500'
                              }`}
                            />
                          </motion.div>
                          <p className="text-xl font-semibold text-white mb-2">
                            {isDragActive
                              ? 'Drop files here!'
                              : 'Drag & drop files here'}
                          </p>
                          <p className="text-slate-400 mb-4">
                            or click to browse from your device
                          </p>
                          <div className="flex gap-4 text-sm text-slate-500">
                            <span>
                              Max size: {mediaType === 'image' ? '10MB' : '100MB'}
                            </span>
                            <span>•</span>
                            <span>
                              Formats:{' '}
                              {mediaType === 'image'
                                ? 'JPG, PNG, GIF'
                                : 'MP4, WebM'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {files.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <AnimatePresence>
                            {files.map((file) => (
                              <motion.div
                                key={file.preview}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="relative group rounded-lg overflow-hidden bg-slate-800 border border-slate-700"
                                whileHover={{ scale: 1.05 }}
                              >
                                <div
                                  className="relative aspect-video cursor-pointer"
                                  onClick={() => setExpandedFile(file.preview)}
                                >
                                  {mediaType === 'image' ? (
                                    <img
                                      src={file.preview}
                                      alt={file.file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <video
                                      src={file.preview}
                                      className="w-full h-full object-cover"
                                    />
                                  )}
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>

                                <div className="p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-white truncate">
                                        {file.file.name}
                                      </p>
                                      <p className="text-xs text-slate-400">
                                        {formatFileSize(file.file.size)}
                                      </p>
                                    </div>
                                    <motion.button
                                      onClick={() => removeFile(file.preview)}
                                      className="ml-2 p-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                                      whileHover={{ scale: 1.1 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <X className="w-4 h-4" />
                                    </motion.button>
                                  </div>

                                  <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${file.progress}%` }}
                                      className={`h-full rounded-full ${
                                        file.uploaded
                                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                          : 'bg-gradient-to-r from-cyan-500 to-purple-500'
                                      }`}
                                    />
                                  </div>
                                  <div className="flex items-center justify-between mt-2">
                                    <span className="text-xs text-slate-400">
                                      {file.progress}%
                                    </span>
                                    {file.uploaded && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                      >
                                        <Check className="w-4 h-4 text-green-400" />
                                      </motion.div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </motion.div>
                      )}
                    </GamingCard>

                    <GamingCard className="p-6">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        Media Details
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <Label htmlFor="title" className="text-white mb-2 block">
                            Title <span className="text-red-400">*</span>
                          </Label>
                          <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter an epic title..."
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                            maxLength={100}
                            dir="auto"
                          />
                          <p className="text-xs text-slate-400 mt-1 text-right">
                            {title.length}/100
                          </p>
                        </div>

                        <div>
                          <Label
                            htmlFor="description"
                            className="text-white mb-2 block"
                          >
                            Description
                          </Label>
                          <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Tell us about this moment..."
                            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-purple-400 focus:ring-purple-400/20 min-h-[120px]"
                            maxLength={500}
                            dir="auto"
                          />
                          <p className="text-xs text-slate-400 mt-1 text-right">
                            {description.length}/500
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="game" className="text-white mb-2 block">
                            Game
                          </Label>
                          <Select
                            value={selectedGame}
                            onValueChange={setSelectedGame}
                          >
                            <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-pink-400 focus:ring-pink-400/20">
                              <SelectValue placeholder="Select a game" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700">
                              {MOCK_GAMES.map((game) => (
                                <SelectItem
                                  key={game}
                                  value={game}
                                  className="text-white hover:bg-slate-700"
                                >
                                  {game}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </GamingCard>
                  </div>

                  <div className="space-y-6">
                    <GamingCard className="p-6">
                      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Tag className="w-5 h-5 text-cyan-400" />
                        Tags
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {MOCK_TAGS.map((tag) => (
                          <motion.button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                              selectedTags.includes(tag)
                                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg shadow-cyan-500/30'
                                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                              boxShadow: selectedTags.includes(tag)
                                ? '0 0 20px rgba(6, 182, 212, 0.4)'
                                : '0 0 0px rgba(6, 182, 212, 0)',
                            }}
                          >
                            {selectedTags.includes(tag) && (
                              <Check className="w-3 h-3 inline mr-1" />
                            )}
                            {tag}
                          </motion.button>
                        ))}
                      </div>
                    </GamingCard>

                    <GamingCard className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            htmlFor="featured"
                            className="text-white font-semibold"
                          >
                            Featured Content
                          </Label>
                          <p className="text-sm text-slate-400 mt-1">
                            Highlight this in the gallery
                          </p>
                        </div>
                        <motion.div
                          animate={{
                            boxShadow: featured
                              ? '0 0 20px rgba(168, 85, 247, 0.6)'
                              : '0 0 0px rgba(168, 85, 247, 0)',
                          }}
                          className="rounded-full"
                        >
                          <Switch
                            id="featured"
                            checked={featured}
                            onCheckedChange={setFeatured}
                          />
                        </motion.div>
                      </div>
                    </GamingCard>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <GamingButton
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-14 text-lg font-bold relative overflow-hidden group"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"
                          animate={{
                            x: isSubmitting ? ['-100%', '100%'] : '0%',
                          }}
                          transition={{
                            duration: 1,
                            repeat: isSubmitting ? Infinity : 0,
                          }}
                        />
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  ease: 'linear',
                                }}
                              >
                                <Sparkles className="w-5 h-5" />
                              </motion.div>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 group-hover:translate-y-[-2px] transition-transform" />
                              Publish Media
                            </>
                          )}
                        </span>
                      </GamingButton>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expandedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedFile(null)}
            className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              <button
                onClick={() => setExpandedFile(null)}
                className="absolute -top-12 right-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              {mediaType === 'image' ? (
                <img
                  src={expandedFile}
                  alt="Preview"
                  className="w-full h-auto rounded-xl"
                />
              ) : (
                <video
                  src={expandedFile}
                  controls
                  className="w-full h-auto rounded-xl"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      <UploadMediaDialog
      showUploadModal={showUploadModal}
      setShowUploadModal={setShowUploadModal}
      />
    </div>
  );
}

function AnimatedParticles() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, ${
              ['#06b6d4', '#a855f7', '#ec4899'][Math.floor(Math.random() * 3)]
            }, transparent)`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
