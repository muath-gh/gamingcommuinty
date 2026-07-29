"use client";

import { Flame, SlidersHorizontal } from "lucide-react";
import { GlowText } from "@/components/gaming/GlowText";
import SelectTile from "../SelectTile";

const OPTIONS = [
  {
    value: "hard",
    image: "/images/hard.png",
    label: "صعب",
    description: "تحدٍ حقيقي بدون رحمة، كل خطوة تهم",
  },
  {
    value: "adjustable",
    image: "/images/adjustable.png",
    label: "عادي / قابل للتعديل",
    description: "تحكم كامل في مستوى الصعوبة حسب مزاجك",
  },
];

interface Step2DifficultyProps {
  difficultyPref: string | null;
  setDifficulty: (value: string) => void;
}

export default function Step2Difficulty({
  difficultyPref,
  setDifficulty,
}: Step2DifficultyProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
        <GlowText color="purple">ما مستوى الصعوبة الذي تفضله؟</GlowText>
      </h2>
      <p className="text-slate-400 mb-6">
        هذا يساعدنا على فهم مدى التحدي الذي تبحث عنه
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => (
          <SelectTile
            key={opt.value}
            image={opt.image}
            label={opt.label}
            description={opt.description}
            selected={difficultyPref === opt.value}
            onClick={() => setDifficulty(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
