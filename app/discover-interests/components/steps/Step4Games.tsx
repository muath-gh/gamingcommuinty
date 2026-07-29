'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GlowText } from '@/components/gaming/GlowText';
import type { GameOption } from '../WizardShell';

interface Step4GamesProps {
  games: GameOption[];
  selectedGames: string[];
  toggleGame: (id: string) => void;
}

export default function Step4Games({ games, selectedGames, toggleGame }: Step4GamesProps) {
  const [query, setQuery] = useState('');

  const selectedGameObjects = useMemo(
    () => games.filter((g) => selectedGames.includes(g.id)),
    [games, selectedGames]
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    // البحث يبدأ فقط من 4 أحرف فما فوق
    if (q.length < 4) return games.slice(0, 10);
    return games.filter((g) => g.name.toLowerCase().includes(q));
  }, [query, games]);

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
        <GlowText color="purple">ما الألعاب التي لعبتها من قبل؟</GlowText>
      </h2>
      <p className="text-slate-400 mb-6">
        ابحث واختر الألعاب التي جربتها ({selectedGames.length} مختارة)
      </p>

      {selectedGameObjects.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 p-3 rounded-xl bg-slate-900/50 border border-blue-500/30">
          <AnimatePresence>
            {selectedGameObjects.map((game) => (
              <motion.button
                key={game.id}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => toggleGame(game.id)}
                className="px-3 py-1.5 rounded-full text-sm bg-blue-500/15 border border-blue-500 text-blue-400 flex items-center gap-1.5"
              >
                {game.name}
                <X className="w-3 h-3" />
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
      )}

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث عن لعبة (4 أحرف فأكثر)..."
        className="w-full mb-4 rounded-xl bg-slate-900/70 border border-slate-700 focus:border-purple-500 focus:outline-none px-4 py-3 text-white placeholder:text-slate-500 text-right"
      />

      <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-1">
        {results.length === 0 && <p className="text-slate-500 text-sm">لا توجد نتائج مطابقة</p>}
        {results.map((game) => {
          const isSelected = selectedGames.includes(game.id);
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => toggleGame(game.id)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                isSelected
                  ? 'bg-purple-500/20 border-purple-500 text-white'
                  : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-blue-500/60 hover:text-white'
              }`}
            >
              {game.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
