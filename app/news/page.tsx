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
    <div className="min-h-screen ambient-bg text-cream">
      <div className="relative overflow-hidden py-20 px-6">
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
            <Badge variant="warning" glow className="mb-6 inline-flex">
              <Zap className="w-4 h-4 ml-2" />
              {news.length} خبر جديد
            </Badge>

            <h1 className="text-6xl md:text-7xl font-black mb-4 text-cream">
              <GlowText color="blue">أخبار</GlowText> الألعاب
            </h1>

            <p className="text-xl text-cream-muted max-w-3xl mx-auto">
              آخر المستجدات والأخبار الحصرية من عالم الألعاب
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="relative">
              <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-6 h-6 text-cream-muted" />
              <input
                type="text"
                placeholder="ابحث عن خبر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full input-gaming rounded-2xl pr-16 pl-6 py-5 text-lg text-right"
              />
              {searchQuery && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-cream-muted hover:text-cream transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-6 h-6 text-blue-400" />
            <h2 className="text-2xl font-bold text-cream">الفئات</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                !selectedCategory ? 'btn-primary glow-blue' : 'btn-ghost'
              }`}
            >
              الكل
            </button>

            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedCategory === category ? 'btn-primary glow-blue' : 'btn-ghost'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="surface rounded-xl p-6">
                <div className="h-6 w-24 skeleton-shimmer rounded mb-4" />
                <div className="h-8 w-3/4 skeleton-shimmer rounded mb-3" />
                <div className="h-4 w-full skeleton-shimmer rounded mb-2" />
                <div className="h-4 w-1/2 skeleton-shimmer rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {featuredNews.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-cream">
                  <TrendingUp className="w-8 h-8 text-amber-400" />
                  أخبار مميزة
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredNews.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`}>
                      <GamingCard hover glow className="h-full cursor-pointer">
                        <div className="p-6">
                          <Badge variant="warning">{item.category}</Badge>
                          <h3 className="text-2xl font-bold mt-4 text-right text-cream group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-cream-muted mt-2 text-right">
                            {item.excerpt}
                          </p>
                          <div className="flex justify-between mt-4 text-sm text-cream-muted">
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

            {filteredNews.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-cream">
                  <Clock className="w-8 h-8 text-blue-400" />
                  آخر الأخبار
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredNews.map((item) => (
                    <Link key={item.id} href={`/news/${item.slug}`}>
                      <GamingCard hover className="h-full cursor-pointer">
                        <div className="p-6">
                          <Badge variant="info">{item.category}</Badge>
                          <h3 className="text-xl font-bold mt-4 text-right text-cream group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-cream-muted mt-2 text-right text-sm">
                            {item.excerpt}
                          </p>
                          <div className="flex justify-between mt-4 text-sm text-cream-muted border-t border-neon-blue/10 pt-4">
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

            {filteredNews.length === 0 && featuredNews.length === 0 && (
              <div className="text-center py-20">
                <Newspaper className="w-20 h-20 text-cream-muted/30 mx-auto mb-4" />
                <p className="text-2xl text-cream-muted">لم يتم العثور على أخبار</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
