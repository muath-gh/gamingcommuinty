'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { GlowText } from '@/components/gaming/GlowText';
import ProgressBar from './ProgressBar';
import Step1Genre from './steps/Step1Genre';
import Step2Difficulty from './steps/Step2Difficulty';
import Step3Playstyle from './steps/Step3Playstyle';
import Step4Games from './steps/Step4Games';
import Step5Recommendation from './steps/Step5Recommendation';

export const TOTAL_STEPS = 5;

export interface GameOption {
  id: string;
  name: string;
  slug: string;
}

export default function WizardShell() {
  const [currentStep, setCurrentStep] = useState(0);
  const [genrePref, setGenrePref] = useState<string | null>(null);
  const [difficultyPref, setDifficultyPref] = useState<string | null>(null);
  const [playstyle, setPlaystyle] = useState<string[]>([]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);
  const [games, setGames] = useState<GameOption[]>([]);

  useEffect(() => {
    fetch('/api/games')
      .then((r) => r.json())
      .then(setGames)
      .catch(() => setGames([]));
  }, []);

  const togglePlaystyle = (value: string) =>
    setPlaystyle((prev) => (prev.includes(value) ? prev.filter((p) => p !== value) : [...prev, value]));

  const toggleGame = (id: string) =>
    setSelectedGames((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const reset = () => {
    setCurrentStep(0);
    setGenrePref(null);
    setDifficultyPref(null);
    setPlaystyle([]);
    setSelectedGames([]);
  };

  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const canGoNext = [
    Boolean(genrePref),
    Boolean(difficultyPref),
    playstyle.length > 0,
    selectedGames.length > 0,
    true,
  ][currentStep];

  const steps = [
    <Step1Genre key="genre" genrePref={genrePref} setGenre={setGenrePref} />,
    <Step2Difficulty key="difficulty" difficultyPref={difficultyPref} setDifficulty={setDifficultyPref} />,
    <Step3Playstyle key="playstyle" playstyle={playstyle} togglePlaystyle={togglePlaystyle} />,
    <Step4Games key="games" games={games} selectedGames={selectedGames} toggleGame={toggleGame} />,
    <Step5Recommendation
      key="recommendation"
      genrePref={genrePref}
      difficultyPref={difficultyPref}
      playstyle={playstyle}
      games={games}
      selectedGames={selectedGames}
      reset={reset}
    />,
  ];

  return (
    <div className="w-full flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-lg sm:text-xl font-extrabold">
          <GlowText color="purple">إعداد ملفك الشخصي للألعاب</GlowText>
        </h1>
        <button
          type="button"
          onClick={reset}
          className="text-xs sm:text-sm text-slate-400 hover:text-pink-400 transition-colors"
        >
          إعادة تعيين الملف الشخصي
        </button>
      </header>

      <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />

      <div className="mt-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {steps[currentStep]}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isLastStep && (
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="rounded-xl px-5 py-2.5 font-semibold border border-slate-700 text-slate-300 disabled:opacity-30 hover:bg-slate-800/50 transition-colors"
          >
            السابق
          </button>
          <button
            type="button"
            onClick={nextStep}
            disabled={!canGoNext}
            className="rounded-xl px-6 py-2.5 font-bold bg-gradient-to-l from-purple-500 to-pink-500 text-white disabled:opacity-30 glow-purple"
          >
            التالي
          </button>
        </div>
      )}
    </div>
  );
}
