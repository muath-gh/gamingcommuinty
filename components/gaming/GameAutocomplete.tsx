// app/components/GameAutocomplete.tsx
"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Loader } from "lucide-react";

type GameDTO = {
  id: string;
  name: string;
  slug: string;
};

interface GameAutocompleteProps {
  value: string;
  onChange: (gameId: string, gameName: string) => void;
  placeholder?: string;
}

export function GameAutocomplete({
  value,
  onChange,
  placeholder = "ابحث عن اللعبة...",
}: GameAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GameDTO[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGame, setSelectedGame] = useState<GameDTO | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);

    if (searchQuery.length < 1) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const response = await fetch(
        `/api/games/search?q=${encodeURIComponent(searchQuery)}`,
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelect = (game: GameDTO) => {
    setSelectedGame(game);
    onChange(game.id, game.name);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedGame(null);
    setQuery("");
    setResults([]);
    onChange("", "");
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute right-6 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={selectedGame ? selectedGame.name : query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full bg-slate-800/80 border-2 border-slate-700 rounded-xl px-6 py-4 text-lg pr-14 focus:outline-none focus:border-cyan-500 transition-all text-right"
        />
        {selectedGame && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={handleClear}
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
        {isLoading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="absolute left-6 top-1/2 transform -translate-y-1/2"
          >
            <Loader className="w-5 h-5 text-cyan-400" />
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl shadow-cyan-500/20 overflow-hidden z-50"
          >
            <div className="max-h-80 overflow-y-auto">
              {results.map((game, index) => (
                <motion.button
                  key={game.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSelect(game)}
                  className="w-full px-6 py-3 text-right hover:bg-slate-700/50 transition-colors border-b border-slate-700/30 last:border-b-0"
                >
                  <div className="font-semibold text-white">{game.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {game.slug}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && results.length === 0 && query.length > 0 && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl p-6 text-center text-slate-400 z-50"
        >
          لا توجد نتائج
        </motion.div>
      )}
    </div>
  );
}
