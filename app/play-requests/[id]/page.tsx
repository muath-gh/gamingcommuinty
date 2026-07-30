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
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "../../../hooks/use-auth";
import { GamingButton } from "@/components/gaming/GamingButton";
import { GamingCard } from "@/components/gaming/GamingCard";
import { Badge } from "@/components/gaming/Badge";
import { GlowText } from "@/components/gaming/GlowText";
import { PlayerAvatar } from "@/components/gaming/PlayerAvatar";

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

      toast.success("تم المغادرة بنجاح");
      setTimeout(() => router.push("/discovery"), 500);
    } catch (error) {
      toast.error("فشل المغادرة");
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

      toast.success("تم حذف الطلب");
      setTimeout(() => router.push("/discovery"), 500);
    } catch (error) {
      toast.error("فشل الحذف");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen ambient-bg flex items-center justify-center">
        <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-neon-cyan/30 border-t-neon-cyan-bright rounded-full"
        />
      </div>
    );
  }

  if (!playRequest) {
    return (
      <div className="min-h-screen ambient-bg flex items-center justify-center p-6">
        <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />
        <GamingCard className="p-12 text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-xl bg-ink-925 border border-neon-cyan/15 mb-6">
            <Gamepad2 className="w-10 h-10 text-cream-dim" />
          </div>
          <h2 className="font-display text-2xl font-black text-cream mb-2">
            الطلب غير موجود
          </h2>
          <p className="text-cream-muted mb-8">
            قد يكون الطلب محذوفاً أو غير متاح حالياً
          </p>
          <Link href="/discovery">
            <GamingButton variant="ghost" glow>
              <ArrowLeft className="w-4 h-4" />
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
    <div className="min-h-screen ambient-bg text-cream">
      <div className="fixed inset-0 grid-pattern pointer-events-none opacity-30" />

      {/* ================== HEADER ================== */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass-strong border-b border-neon-cyan/15"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <motion.button
              whileHover={{ x: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push("/discovery")}
              className="flex items-center gap-2 text-neon-cyan-bright hover:text-neon-cyan transition-colors group"
            >
              <motion.div animate={{ x: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowLeft className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-bold">العودة</span>
            </motion.button>

            <div className="flex-1 mx-4 min-w-0 text-center">
              <p className="text-xs text-cream-dim tracking-widest mb-1">غرفة اللعب</p>
              <h1 className="font-display text-lg sm:text-2xl font-black text-cream line-clamp-1">
                {playRequest.title}
              </h1>
            </div>

            {isFull ? (
              <Badge variant="danger" glow>ممتلئة</Badge>
            ) : (
              <Badge variant="success" glow>
                <span className="w-2 h-2 rounded-full bg-success animate-live-dot" />
                متاحة
              </Badge>
            )}
          </div>
        </div>
      </motion.div>

      {/* ================== CONTENT ================== */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ================== SIDEBAR ================== */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Game info */}
            <GamingCard glow accent="cyan" className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25">
                  <Gamepad2 className="w-4 h-4 text-neon-cyan-bright" />
                </div>
                <p className="text-cream-muted text-xs tracking-wider font-bold">اللعبة</p>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black mb-4">
                <GlowText color="cyan">{playRequest.game.name}</GlowText>
              </h2>
              <p className="text-cream-muted leading-relaxed text-sm">
                {playRequest.description}
              </p>
            </GamingCard>

            {/* Owner */}
            <GamingCard glow accent="amber" className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neon-amber/10 border border-neon-amber/25">
                  <Crown className="w-4 h-4 text-neon-amber-bright" />
                </div>
                <p className="text-cream-muted text-xs tracking-wider font-bold">مالك الطلب</p>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-ink-925/60 border border-neon-cyan/10">
                <PlayerAvatar name={playRequest.user.name} src={playRequest.user.avatar} size="lg" rank="gold" showStatus />
                <div>
                  <p className="font-bold text-cream">{playRequest.user.name}</p>
                  <p className="text-xs text-cream-dim">صاحب الغرفة</p>
                </div>
              </div>
            </GamingCard>

            {/* Stats */}
            <GamingCard glow accent="cyan" className="p-6 sm:p-8">
              <div className="space-y-6">
                <div>
                  <p className="text-cream-muted text-xs tracking-wider font-bold mb-3">المشاركون</p>
                  <motion.p
                    initial={{ scale: 0.85 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="font-display text-5xl font-black"
                  >
                    <GlowText color="cyan">
                      {playRequest.participants.length}/{playRequest.playersNeeded}
                    </GlowText>
                  </motion.p>
                </div>

                <div className="pt-6 border-t border-neon-cyan/10">
                  <p className="text-cream-muted text-xs tracking-wider font-bold mb-3">تاريخ الإنشاء</p>
                  <div className="flex items-center gap-2 text-cream-muted">
                    <Calendar className="w-4 h-4 text-neon-cyan-bright" />
                    <span className="text-sm">
                      {new Date(playRequest.createdAt).toLocaleDateString("ar")}
                    </span>
                  </div>
                </div>
              </div>
            </GamingCard>

            {/* Actions */}
            <div className="space-y-3">
              {!isOwner && !isParticipant && !isFull && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <GamingButton variant="primary" className="w-full" glow>
                    <Users className="w-5 h-5" />
                    انضم الآن
                  </GamingButton>
                </motion.div>
              )}

              {isParticipant && !isOwner && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <GamingButton
                    variant="danger"
                    className="w-full"
                    onClick={handleLeaveRequest}
                    disabled={leavingId === requestId}
                  >
                    <LogOut className="w-5 h-5" />
                    {leavingId === requestId ? "جاري المغادرة..." : "غادر الطلب"}
                  </GamingButton>
                </motion.div>
              )}

              {isOwner && (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <GamingButton
                    variant="danger"
                    className="w-full"
                    onClick={handleDeleteRequest}
                    disabled={deletingId === requestId}
                  >
                    <Trash2 className="w-5 h-5" />
                    {deletingId === requestId ? "جاري الحذف..." : "حذف الطلب"}
                  </GamingButton>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* ================== MAIN CONTENT ================== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Participants */}
            <GamingCard glow accent="cyan" className="p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25">
                  <Users className="w-4 h-4 text-neon-cyan-bright" />
                </div>
                <h3 className="font-display text-2xl font-black text-cream">المشاركون الحاليون</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playRequest.participants.map((participant, index) => (
                  <motion.div
                    key={participant.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08 }}
                    whileHover={{ x: 8, scale: 1.02 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-ink-925/50 border border-neon-cyan/10 hover:border-neon-cyan/40 transition-colors"
                  >
                    <PlayerAvatar name={participant.user.name} src={participant.user.avatar} size="md" online showStatus />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-cream truncate">{participant.user.name}</p>
                      <p className="text-xs text-cream-dim">انضم حديثاً</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GamingCard>

            {/* Chat */}
            <GamingCard glow accent="cyan" className="p-6 sm:p-8 flex flex-col min-h-96 sm:min-h-[500px]">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-neon-cyan/10">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-neon-cyan/10 border border-neon-cyan/25">
                  <MessageSquare className="w-4 h-4 text-neon-cyan-bright" />
                </div>
                <h3 className="font-display text-2xl font-black text-cream">الدردشة</h3>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto mb-6 space-y-4 scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {messages.length === 0 ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-ink-925 border border-neon-cyan/10 mb-4">
                          <Send className="w-7 h-7 text-cream-dim" />
                        </div>
                        <p className="text-cream-dim font-bold">لا توجد رسائل حتى الآن</p>
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
                        className={`flex gap-3 ${
                          msg.user.id === currentUser?.id
                            ? "flex-row-reverse justify-end"
                            : "justify-start"
                        }`}
                      >
                        <PlayerAvatar name={msg.user.name} src={msg.user.avatar} size="sm" />
                        <div
                          className={`max-w-xs rounded-2xl p-4 ${
                            msg.user.id === currentUser?.id
                              ? "bg-gradient-to-br from-neon-cyan to-neon-cyan-deep text-ink-950"
                              : "bg-ink-925/70 text-cream-muted border border-neon-cyan/10"
                          }`}
                        >
                          <p className="text-xs opacity-70 mb-1 font-bold">{msg.user.name}</p>
                          <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              {(isParticipant || isOwner) && (
                <form onSubmit={handleSendMessage} className="flex gap-3 mt-auto">
                  <input
                    type="text"
                    placeholder="اكتب رسالتك هنا..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="input-gaming flex-1 rounded-xl px-5 py-3.5 text-right"
                    dir="rtl"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={sendingMessage || !messageInput.trim()}
                    className="btn-primary px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </motion.button>
                </form>
              )}

              {!isParticipant && !isOwner && (
                <div className="text-center py-4 text-cream-dim text-sm border-t border-neon-cyan/10 mt-auto">
                  انضم للطلب لكي تتمكن من المشاركة في الدردشة
                </div>
              )}
            </GamingCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
