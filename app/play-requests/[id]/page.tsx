"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Send,
  LogOut,
  Crown,
  Trash2,
  ArrowLeft,
  Gamepad2,
  Calendar,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "../../../hooks/use-auth";
import { GamingButton } from "@/components/gaming/GamingButton";
import { GamingCard } from "@/components/gaming/GamingCard";
import { GlowText } from "@/components/gaming/GlowText";

type PlayRequest = {
  id: string;
  title: string;
  description: string;
  gameId: string;
  playersNeeded: number;
  isOpen: boolean;
  user: { id: string; name: string; avatar: string };
  game: { id: string; name: string };
  participants: any[];
  createdAt: string;
};

type Message = {
  id: string;
  content: string;
  user: { id: string; name: string; avatar: string };
  createdAt: string;
};

export default function PlayRequestPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const requestId = params.id as string;

  const [playRequest, setPlayRequest] = useState<PlayRequest | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, msgRes] = await Promise.all([
          fetch(`/api/play-requests/${requestId}`),
          fetch(`/api/play-requests/${requestId}/messages`),
        ]);

        if (reqRes.ok) {
          const data = await reqRes.json();
          setPlayRequest(data.playRequest);
        }

        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(data.messages.reverse());
        }
      } catch (error) {
        toast.error("فشل تحميل الطلب");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(async () => {
      try {
        const msgRes = await fetch(`/api/play-requests/${requestId}/messages`);
        if (msgRes.ok) {
          const data = await msgRes.json();
          setMessages(data.messages.reverse());
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [requestId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setSendingMessage(true);
    try {
      const res = await fetch(`/api/play-requests/${requestId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": currentUser?.id || "",
        },
        body: JSON.stringify({ content: messageInput }),
      });

      if (!res.ok) throw new Error("فشل إرسال الرسالة");

      setMessageInput("");

      const msgRes = await fetch(`/api/play-requests/${requestId}/messages`);
      if (msgRes.ok) {
        const data = await msgRes.json();
        setMessages(data.messages.reverse());
      }
    } catch (error) {
      toast.error("فشل إرسال الرسالة");
    } finally {
      setSendingMessage(false);
    }
  };

  const handleLeaveRequest = async () => {
    setLeavingId(requestId);
    try {
      const res = await fetch(`/api/play-requests/${requestId}/leave`, {
        method: "POST",
        headers: { "x-user-id": currentUser?.id || "" },
      });

      if (!res.ok) throw new Error("فشل المغادرة");

      toast.success("✅ تم المغادرة بنجاح");
      setTimeout(() => router.push("/discovery"), 500);
    } catch (error) {
      toast.error("❌ فشل المغادرة");
    } finally {
      setLeavingId(null);
    }
  };

  const handleDeleteRequest = async () => {
    setDeletingId(requestId);
    try {
      const res = await fetch(`/api/play-requests/${requestId}`, {
        method: "DELETE",
        headers: { "x-user-id": currentUser?.id || "" },
      });

      if (!res.ok) throw new Error("فشل الحذف");

      toast.success("✅ تم حذف الطلب");
      setTimeout(() => router.push("/discovery"), 500);
    } catch (error) {
      toast.error("❌ فشل الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!playRequest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
        <GamingCard glow className="p-12 text-center">
          <Gamepad2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-300 mb-2">
            الطلب غير موجود
          </h2>
          <p className="text-slate-400 mb-6">
            قد يكون الطلب محذوفاً أو غير متاح حالياً
          </p>
          <Link href="/discovery">
            <GamingButton variant="accent" glow>
              <ArrowLeft className="w-4 h-4 ml-2" />
              العودة للاكتشاف
            </GamingButton>
          </Link>
        </GamingCard>
      </div>
    );
  }

  const isOwner = currentUser?.id === playRequest.user.id;
  const isParticipant = playRequest.participants.some(
    (p) => p.userId === currentUser?.id,
  );
  const isFull = playRequest.participants.length === playRequest.playersNeeded;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* ================== HEADER ================== */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-gradient-to-b from-slate-900/90 to-slate-900/30 backdrop-blur-xl border-b border-slate-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* الباك بوتن */}
            <motion.button
              whileHover={{ x: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/discovery")}
              className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors group"
            >
              <motion.div
                animate={{ x: [0, -3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </motion.div>
              <span className="text-sm font-bold">العودة</span>
            </motion.button>

            {/* العنوان والحالة */}
            <div className="flex-1 mx-6">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">
                غرفة اللعب
              </p>
              <h1 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent line-clamp-1">
                {playRequest.title}
              </h1>
            </div>

            {/* شارة الحالة */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`px-4 py-2 rounded-full font-bold text-sm ${
                isFull
                  ? "bg-red-500/20 text-red-400 border border-red-500/30"
                  : "bg-green-500/20 text-green-400 border border-green-500/30"
              }`}
            >
              {isFull ? "🔴 ممتلئة" : "🟢 متاحة"}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ================== CONTENT ================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================== SIDEBAR ================== */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* معلومات اللعبة */}
            <GamingCard
              glow
              className="p-6 sm:p-8 relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                    اللعبة
                  </p>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  {playRequest.game.name}
                </h2>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {playRequest.description}
                </p>
              </div>
            </GamingCard>

            {/* معلومات المالك */}
            <GamingCard
              glow
              className="p-6 sm:p-8 relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold">
                    مالك الطلب
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/80 to-slate-800/40 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {playRequest.user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-white">
                      {playRequest.user.name}
                    </p>
                    <p className="text-xs text-slate-500">صاحب الغرفة</p>
                  </div>
                </motion.div>
              </div>
            </GamingCard>

            {/* إحصائيات */}
            <GamingCard
              glow
              className="p-6 sm:p-8 relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative space-y-6">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3">
                    المشاركون
                  </p>
                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent"
                  >
                    {playRequest.participants.length}/
                    {playRequest.playersNeeded}
                  </motion.p>
                </div>

                <div className="pt-6 border-t border-slate-700">
                  <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-3">
                    تاريخ الإنشاء
                  </p>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Calendar className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm">
                      {new Date(playRequest.createdAt).toLocaleDateString("ar")}
                    </span>
                  </div>
                </div>
              </div>
            </GamingCard>

            {/* الأزرار */}
            <div className="space-y-3">
              {!isOwner && !isParticipant && !isFull && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GamingButton variant="accent" className="w-full" glow>
                    <Users className="w-5 h-5 ml-2" />
                    انضم الآن
                  </GamingButton>
                </motion.div>
              )}

              {isParticipant && !isOwner && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GamingButton
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                    onClick={handleLeaveRequest}
                    disabled={leavingId === requestId}
                  >
                    <LogOut className="w-5 h-5 ml-2" />
                    {leavingId === requestId
                      ? "جاري المغادرة..."
                      : "غادر الطلب"}
                  </GamingButton>
                </motion.div>
              )}

              {isOwner && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GamingButton
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/50"
                    onClick={handleDeleteRequest}
                    disabled={deletingId === requestId}
                  >
                    <Trash2 className="w-5 h-5 ml-2" />
                    {deletingId === requestId ? "جاري الحذف..." : "حذف الطلب"}
                  </GamingButton>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ================== MAIN CONTENT ================== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* المشاركون */}
            <GamingCard
              glow
              className="p-6 sm:p-8 relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                <h3 className="text-2xl sm:text-3xl font-black mb-6">
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    المشاركون الحاليون
                  </span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {playRequest.participants.map((participant, index) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 8, scale: 1.02 }}
                      className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-2xl border border-slate-700/50 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                        {participant.user.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white truncate">
                          {participant.user.name}
                        </p>
                        <p className="text-xs text-slate-500">انضم حديثاً</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </GamingCard>

            {/* صندوق الدردشة */}
            <GamingCard
              glow
              className="p-6 sm:p-8 relative overflow-hidden group flex flex-col min-h-96 sm:min-h-[500px]"
            >
              <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative flex flex-col h-full">
                <h3 className="text-2xl sm:text-3xl font-black mb-6 pb-4 border-b border-slate-700">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    الدردشة
                  </span>
                </h3>

                {/* الرسائل */}

                <div className="flex-1 overflow-y-auto mb-6 space-y-4 scrollbar-hide">
                  <AnimatePresence mode="popLayout">
                    {messages.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center h-full"
                      >
                        <div className="text-center">
                          <Send className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-500" />
                          <p className="text-slate-500 font-bold">
                            لا توجد رسائل حتى الآن
                          </p>
                        </div>
                      </motion.div>
                    ) : (
                      messages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          // ✅ صح: رسائلي على اليمين، الآخرين على اليسار
                          className={`flex gap-3 ${
                            msg.user.id === currentUser?.id
                              ? "flex-row-reverse justify-end" // ✅ على اليمين
                              : "justify-start" // ✅ على اليسار
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {msg.user.name.charAt(0)}
                          </div>
                          <div
                            className={`max-w-xs rounded-2xl p-4 ${
                              msg.user.id === currentUser?.id
                                ? "bg-gradient-to-br from-cyan-600 to-blue-600 text-white" // ✅ أزرق للـ mine
                                : "bg-slate-800/70 text-slate-300 border border-slate-700/50" // ✅ رمادي للـ others
                            }`}
                          >
                            <p className="text-xs opacity-70 mb-1 font-semibold">
                              {msg.user.name}
                            </p>
                            <p className="text-sm">{msg.content}</p>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* صندوق الإدخال */}
                {(isParticipant || isOwner) && (
                  <form
                    onSubmit={handleSendMessage}
                    className="flex gap-3 mt-auto"
                  >
                    <input
                      type="text"
                      placeholder="اكتب رسالتك هنا..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 bg-slate-800/50 border border-slate-700 rounded-2xl px-5 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-right"
                      dir="rtl"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={sendingMessage || !messageInput.trim()}
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-2xl transition-all font-bold flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </form>
                )}

                {!isParticipant && !isOwner && (
                  <div className="text-center py-4 text-slate-500 text-sm border-t border-slate-700 mt-auto">
                    انضم للطلب لكي تتمكن من المشاركة في الدردشة
                  </div>
                )}
              </div>
            </GamingCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
