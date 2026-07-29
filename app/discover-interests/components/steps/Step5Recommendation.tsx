'use client';

import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send } from 'lucide-react';
import { GamingButton } from '@/components/gaming/GamingButton';
import { GlowText } from '@/components/gaming/GlowText';
import type { GameOption } from '../WizardShell';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface EvaluateResult {
  matchScore: number;
  verdict: string;
  explanation: string;
}

function scoreColor(score: number) {
  if (score >= 70) return { text: 'text-green-400', ring: '#4ade80' };
  if (score >= 40) return { text: 'text-yellow-400', ring: '#facc15' };
  return { text: 'text-red-400', ring: '#f87171' };
}

interface Step5RecommendationProps {
  genrePref: string | null;
  difficultyPref: string | null;
  playstyle: string[];
  games: GameOption[];
  selectedGames: string[];
  reset: () => void;
}

export default function Step5Recommendation({
  genrePref,
  difficultyPref,
  playstyle,
  games,
  selectedGames,
  reset,
}: Step5RecommendationProps) {
  const [gameName, setGameName] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<EvaluateResult | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = gameName.trim();
    if (!trimmed) return;

    setStatus('loading');
    setErrorMessage('');

    const profile = {
      genrePref,
      difficultyPref,
      playstyle,
      playedGames: games.filter((g) => selectedGames.includes(g.id)).map((g) => g.name),
    };

    try {
      const res = await fetch('/api/discover-interests/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, gameName: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'حدث خطأ غير متوقع، حاول مرة أخرى');
        setStatus('error');
        return;
      }

      setResult(data);
      setStatus('success');
    } catch {
      setErrorMessage('تعذر الاتصال بالخادم، تحقق من اتصالك وحاول مرة أخرى');
      setStatus('error');
    }
  };

  const checkAnother = () => {
    setStatus('idle');
    setResult(null);
    setGameName('');
  };

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
        <GlowText color="purple">تحقق من توافق أي لعبة مع ملفك الشخصي</GlowText>
      </h2>
      <p className="text-slate-400 mb-6">
        اكتب اسم أي لعبة وسيقوم الذكاء الاصطناعي بتقييم مدى توافقها معك
      </p>

      {status !== 'success' && (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="مثال: Elden Ring"
            disabled={status === 'loading'}
            className="flex-1 rounded-xl bg-slate-900/70 border border-slate-700 focus:border-purple-500 focus:outline-none px-4 py-3 text-white placeholder:text-slate-500 text-right"
          />
          <GamingButton
            type="submit"
            variant="accent"
            glow
            disabled={status === 'loading' || !gameName.trim()}
          >
            {status === 'loading' ? (
              'جاري التحليل...'
            ) : (
              <span className="inline-flex items-center gap-2">
                <Send className="w-4 h-4" /> تحقق الآن
              </span>
            )}
          </GamingButton>
        </form>
      )}

      {status === 'error' && (
        <div className="rounded-xl border border-red-500/50 bg-red-500/10 text-red-300 px-4 py-3 text-sm mb-4">
          {errorMessage}
        </div>
      )}

      <AnimatePresence>
        {status === 'success' && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-2xl p-6 bg-slate-900/60 border border-blue-500/30 text-center"
          >
            <div className="flex flex-col items-center mb-4">
              <div
                className="h-28 w-28 rounded-full flex items-center justify-center text-3xl font-extrabold mb-3"
                style={{
                  background: `conic-gradient(${scoreColor(result.matchScore).ring} ${result.matchScore * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                }}
              >
                <div className="h-[88%] w-[88%] rounded-full bg-slate-950 flex items-center justify-center">
                  <span className={scoreColor(result.matchScore).text}>{result.matchScore}%</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">
                <GlowText color="blue">{result.verdict}</GlowText>
              </h3>
            </div>
            <p className="text-slate-300 leading-relaxed mb-6">{result.explanation}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <GamingButton type="button" variant="ghost" onClick={checkAnother}>
                تحقق من لعبة أخرى
              </GamingButton>
              <GamingButton type="button" variant="secondary" onClick={reset}>
                ابدأ من جديد
              </GamingButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
