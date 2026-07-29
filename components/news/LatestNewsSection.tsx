// ── 3️⃣ Component في الصفحة الرئيسية ──
// استبدل الـ section الألعاب الرائجة بهاي

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Flame, BookOpen } from "lucide-react";
import { GamingButton } from "@/components/gaming/GamingButton";
import { GlowText } from "@/components/gaming/GlowText";
import { Badge } from "@/components/gaming/Badge";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  isFeatured: boolean;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  tags: any[];
};

export default function LatestNewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news/latest");
        const data = await response.json();
        setNews(data.news || []);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <motion.div
      className="mb-24"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="flex justify-between items-center mb-12">
        <motion.h2
          className="text-5xl font-black"
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          آخر <GlowText color="blue">الأخبار</GlowText>
        </motion.h2>
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/news">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <GamingButton variant="ghost">
                عرض جميع الأخبار
                <ArrowLeft className="w-4 h-4 mr-2" />
              </GamingButton>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-96 bg-slate-800/50 rounded-3xl animate-pulse"
            />
          ))}
        </div>
      ) : news.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="h-80 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-2 border-slate-700/50 flex flex-col items-center justify-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <BookOpen className="w-16 h-16 text-slate-600" />
          </motion.div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-300 mb-2">
              لا توجد أخبار حالياً
            </h3>
            <p className="text-slate-500">
              تابعنا لنكون أول من يعرف عن آخر أخبار الألعاب 📰
            </p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
            >
              <Link href={`/news/${item.slug}`}>
                <motion.div
                  className="h-full bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all overflow-hidden group cursor-pointer"
                  whileHover={{ borderColor: "rgba(34, 211, 238, 0.5)" }}
                >
                  {/* Background Glow */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="info" className="text-xs">
                          <Calendar className="w-3 h-3 ml-1" />
                          {new Date(item.createdAt).toLocaleDateString("ar")}
                        </Badge>
                        {item.isFeatured && (
                          <Badge variant="success" className="text-xs">
                            <Flame className="w-3 h-3 ml-1" />
                            رائج
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Content */}
                    <p className="text-slate-300 text-sm line-clamp-3 mb-4 flex-1">
                      {item.excerpt}
                    </p>

                    {/* Category */}
                    <div className="mb-4">
                      <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 rounded-full">
                        {item.category}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                          {item.author.name.charAt(0)}
                        </div>
                        <div className="text-xs">
                          <p className="text-slate-300 font-semibold">
                            {item.author.name}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="text-cyan-400"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
