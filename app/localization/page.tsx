'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Languages, Download, Star, Users, CheckCircle2, TrendingUp, Globe, Sparkles, ArrowRight, Search, Filter, ChevronDown } from 'lucide-react';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GamingCard } from '@/components/gaming/GamingCard';
import { Badge } from '@/components/gaming/Badge';
import { GlowText } from '@/components/gaming/GlowText';

const localizedGames = [
  {
    id: 1,
    title: 'The Last Guardian',
    arabicTitle: 'الحارس الأخير',
    coverImage: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '500 ألف+',
    rating: 4.9,
    status: 'مكتمل',
    translator: 'فريق العرب للترجمة',
    category: 'مغامرات',
    featured: true
  },
  {
    id: 2,
    title: 'Cyberpunk Dreams',
    arabicTitle: 'أحلام السايبربانك',
    coverImage: 'https://images.pexels.com/photos/3945657/pexels-photo-3945657.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '300 ألف+',
    rating: 4.8,
    status: 'مكتمل',
    translator: 'مترجمو الألعاب',
    category: 'آر بي جي',
    featured: true
  },
  {
    id: 3,
    title: 'Shadow Legends',
    arabicTitle: 'أساطير الظلال',
    coverImage: 'https://images.pexels.com/photos/3945635/pexels-photo-3945635.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '450 ألف+',
    rating: 4.7,
    status: 'مكتمل',
    translator: 'فريق النخبة',
    category: 'أكشن',
    featured: false
  },
  {
    id: 4,
    title: 'Kingdom Rising',
    arabicTitle: 'صعود المملكة',
    coverImage: 'https://images.pexels.com/photos/3945668/pexels-photo-3945668.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '250 ألف+',
    rating: 4.6,
    status: 'قيد العمل',
    translator: 'المترجمون المحترفون',
    category: 'استراتيجية',
    featured: false
  },
  {
    id: 5,
    title: 'Racing Thunder',
    arabicTitle: 'رعد السرعة',
    coverImage: 'https://images.pexels.com/photos/1293261/pexels-photo-1293261.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '600 ألف+',
    rating: 4.9,
    status: 'مكتمل',
    translator: 'فريق التعريب العربي',
    category: 'سباقات',
    featured: true
  },
  {
    id: 6,
    title: 'Space Odyssey',
    arabicTitle: 'رحلة الفضاء',
    coverImage: 'https://images.pexels.com/photos/2653362/pexels-photo-2653362.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '350 ألف+',
    rating: 4.8,
    status: 'مكتمل',
    translator: 'فريق المحترفين',
    category: 'خيال علمي',
    featured: false
  },
  {
    id: 7,
    title: 'Dragon Quest',
    arabicTitle: 'مهمة التنين',
    coverImage: 'https://images.pexels.com/photos/3945625/pexels-photo-3945625.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '400 ألف+',
    rating: 4.7,
    status: 'قيد العمل',
    translator: 'نادي المترجمين',
    category: 'مغامرات',
    featured: false
  },
  {
    id: 8,
    title: 'Medieval Warriors',
    arabicTitle: 'محاربو العصور الوسطى',
    coverImage: 'https://images.pexels.com/photos/3945664/pexels-photo-3945664.jpeg?auto=compress&cs=tinysrgb&w=800',
    downloads: '200 ألف+',
    rating: 4.5,
    status: 'مكتمل',
    translator: 'فريق الترجمة الاحترافية',
    category: 'أكشن',
    featured: false
  }
];

const categories = ['الكل', 'مغامرات', 'آر بي جي', 'أكشن', 'استراتيجية', 'سباقات', 'خيال علمي'];
const statuses = ['الكل', 'مكتمل', 'قيد العمل'];

export default function LocalizationHub() {
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [selectedStatus, setSelectedStatus] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGames = localizedGames.filter(game => {
    const matchesCategory = selectedCategory === 'الكل' || game.category === selectedCategory;
    const matchesStatus = selectedStatus === 'الكل' || game.status === selectedStatus;
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         game.arabicTitle.includes(searchQuery);
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const featuredGames = localizedGames.filter(game => game.featured);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.08)_0%,_transparent_50%)]" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        <motion.div
          className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border-b border-slate-800"
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
                <Badge variant="info" glow className="mb-6 inline-flex">
                  <Languages className="w-4 h-4 ml-2" />
                  أكثر من 500 لعبة معربة
                </Badge>
              </motion.div>

              <motion.h1
                className="text-6xl md:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <GlowText color="blue">مركز التعريب</GlowText> العربي
              </motion.h1>

              <motion.p
                className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                اكتشف ألعابك المفضلة مترجمة بالكامل إلى اللغة العربية بجودة احترافية
              </motion.p>
            </motion.div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-16">
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black">
                الألعاب <GlowText color="blue">المميزة</GlowText>
              </h2>
              <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10 }}
                >
                  <GamingCard hover glow className="overflow-hidden group">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={game.coverImage}
                        alt={game.arabicTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                      <motion.div
                        className="absolute top-4 right-4"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <Badge variant="success" glow>
                          <CheckCircle2 className="w-3 h-3 ml-1" />
                          {game.status}
                        </Badge>
                      </motion.div>
                      <div className="absolute top-4 left-4">
                        <Badge variant="info">{game.category}</Badge>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm">
                      <h3 className="text-2xl font-black mb-2 text-white group-hover:text-cyan-400 transition-colors">
                        {game.arabicTitle}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4">{game.title}</p>

                      <div className="flex items-center justify-between mb-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                          <span className="text-yellow-400 font-bold">{game.rating}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Download className="w-4 h-4" />
                          <span>{game.downloads}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-4 text-xs text-slate-500">
                        <Users className="w-3 h-3" />
                        <span>{game.translator}</span>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <GamingButton variant="primary" className="w-full" glow>
                          <Download className="w-4 h-4 ml-2" />
                          تحميل التعريب
                        </GamingButton>
                      </motion.div>
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
            <div className="mb-8">
              <h2 className="text-4xl font-black mb-8">
                جميع <GlowText color="blue">التعريبات</GlowText>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
                <div className="md:col-span-5 relative">
                  <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ابحث عن لعبة..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-12 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="md:col-span-4">
                  <div className="relative">
                    <Filter className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-12 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-3">
                  <div className="relative">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-6 py-4 text-white appearance-none cursor-pointer focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredGames.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                >
                  <GamingCard hover className="group overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={game.coverImage}
                        alt={game.arabicTitle}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge
                          variant={game.status === 'مكتمل' ? 'success' : 'warning'}
                          className="text-xs"
                        >
                          {game.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-1 text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {game.arabicTitle}
                      </h3>
                      <p className="text-slate-400 text-xs mb-3 line-clamp-1">{game.title}</p>

                      <div className="flex items-center justify-between mb-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                          <span className="text-yellow-400 font-bold">{game.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <Download className="w-3 h-3" />
                          <span>{game.downloads}</span>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <GamingButton variant="ghost" size="sm" className="w-full">
                          <Download className="w-3 h-3 ml-1" />
                          تحميل
                        </GamingButton>
                      </motion.div>
                    </div>
                  </GamingCard>
                </motion.div>
              ))}
            </div>

            {filteredGames.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Globe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400 text-lg">لم يتم العثور على نتائج</p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {[
              {
                icon: Languages,
                title: 'ترجمة احترافية',
                description: 'جميع التعريبات تمت بواسطة مترجمين محترفين',
                color: 'from-cyan-500 to-blue-500',
                iconColor: 'text-cyan-400'
              },
              {
                icon: TrendingUp,
                title: 'تحديثات مستمرة',
                description: 'نضيف ألعاب جديدة معربة كل أسبوع',
                color: 'from-blue-500 to-indigo-500',
                iconColor: 'text-blue-400'
              },
              {
                icon: Users,
                title: 'مجتمع نشط',
                description: 'انضم لآلاف اللاعبين العرب',
                color: 'from-green-500 to-emerald-500',
                iconColor: 'text-green-400'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <GamingCard gradient className="p-8 h-full relative overflow-hidden group">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <feature.icon className={`w-12 h-12 ${feature.iconColor} mb-4`} />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-slate-400">{feature.description}</p>
                </GamingCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
