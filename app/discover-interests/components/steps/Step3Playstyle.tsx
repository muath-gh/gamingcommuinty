"use client";

import { Compass, BookOpen, Swords, EyeOff } from "lucide-react";
import { GlowText } from "@/components/gaming/GlowText";
import SelectTile from "../SelectTile";

const OPTIONS = [
  {
    value: "exploration",
    image: "/images/exploration.png",
    label: "استكشاف وحل الألغاز",
    description: "اكتشاف الخرائط والأسرار الخفية مع حل الألغاز",
  },
  {
    value: "story-driven",
    image: "/images/story-driven.png",
    label: "مدفوع بالقصة",
    description: "سرد قوي وشخصيات لا تُنسى",
  },
  {
    value: "combat-focused",
    image: "/images/combat-focused.png",
    label: "قتال",
    description: "معارك سريعة وأنظمة قتال عميقة",
  },
  {
    value: "stealth",
    image: "/images/stealth.png",
    label: "تسلل",
    description: "تجنب الأعداء بذكاء والتحرك خلسة",
  },
];

interface Step3PlaystyleProps {
  playstyle: string[];
  togglePlaystyle: (value: string) => void;
}

export default function Step3Playstyle({
  playstyle,
  togglePlaystyle,
}: Step3PlaystyleProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-1">
        <GlowText color="purple">ما أسلوب اللعب المفضل لديك؟</GlowText>
      </h2>
      <p className="text-slate-400 mb-4">يمكنك اختيار أكثر من نمط واحد</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OPTIONS.map((opt) => (
          <SelectTile
            key={opt.value}
            image={opt.image}
            label={opt.label}
            description={opt.description}
            selected={playstyle.includes(opt.value)}
            onClick={() => togglePlaystyle(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
