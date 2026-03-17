'use client'

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Newspaper,
  Search,
  X,
  Zap,
} from 'lucide-react'

import { GamingCard } from '@/components/gaming/GamingCard'
import { Badge } from '@/components/gaming/Badge'
import { GlowText } from '@/components/gaming/GlowText'

/* ================= TYPES ================= */

interface News {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  isFeatured: boolean
  viewsCount: number
  likesCount: number
  createdAt: string

  author: {
    id: string
    name: string
    avatar?: string | null
  }
}

/* ================= PAGE ================= */

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([])
  const [featuredNews, setFeaturedNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = ['أخبار', 'تحديثات', 'إعلانات', 'مقابلات', 'تقارير']

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const res = await axios.get('/api/news')
      setFeaturedNews(res.data.data.featured)
      setNews(res.data.data.regular)
    } finally {
      setLoading(false)
    }
  }

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getTimeAgo = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInHours = Math.floor(
      (now.getTime() - past.getTime()) / (1000 * 60 * 60)
    )

    if (diffInHours < 1) return 'منذ أقل من ساعة'
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'منذ يوم واحد'
    if (diffInDays < 7) return `منذ ${diffInDays} أيام`
    return past.toLocaleDateString('ar-SA')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ================= HERO ================= */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 py-20 px-6">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg')] opacity-5 bg-cover bg-center" />

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <Badge variant="warning" glow className="mb-6 inline-flex">
              <Zap className="w-4 h-4 ml-2" />
              {news.length} خبر جديد
            </Badge>

            <h1 className="text-6xl md:text-7xl font-black mb-4">
              <GlowText color="blue">أخبار</GlowText> الألعاب
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              آخر المستجدات والأخبار الحصرية من عالم الألعاب
            </p>
          </motion.div>

          {/* SEARCH */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث عن خبر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 backdrop-blur-xl border-2 border-slate-700 rounded-2xl pr-16 pl-6 py-5 text-lg focus:outline-none focus:border-blue-500 transition-all text-right"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* CATEGORIES */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold">الفئات</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-xl font-semibold ${
                !selectedCategory
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                  : 'bg-slate-800/50'
              }`}
            >
              الكل
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                    : 'bg-slate-800/50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FEATURED */}
        {!loading && featuredNews.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-400" />
              أخبار مميزة
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredNews.map((item) => (
                <Link key={item.id} href={`/news/${item.slug}`}>
                  <GamingCard hover glow className="h-full cursor-pointer">
                    <div className="p-6">
                      <Badge variant="warning">{item.category}</Badge>
                      <h3 className="text-2xl font-bold mt-4 text-right">
                        {item.title}
                      </h3>
                      <p className="text-slate-300 mt-2 text-right">
                        {item.excerpt}
                      </p>
                      <div className="flex justify-between mt-4 text-sm text-slate-400">
                        <span>{getTimeAgo(item.createdAt)}</span>
                        <span className="flex gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {item.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {item.viewsCount}
                          </span>
                        </span>
                      </div>
                    </div>
                  </GamingCard>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
