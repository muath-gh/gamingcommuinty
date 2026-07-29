"use client";

import { Route, Globe2, Map, Dices } from "lucide-react";
import { GlowText } from "@/components/gaming/GlowText";
import SelectTile from "../SelectTile";

const OPTIONS = [
  {
    value: "linear",
    image: "/images/linear.png",
    label: "خطي",
    description: "قصة محددة المسار، تقدم واضح من البداية إلى النهاية",
  },
  {
    value: "open-world",
    image: "/images/openworld.png",
    label: "عالم مفتوح",
    description: "حرية استكشاف كاملة، تختار متى وأين تذهب",
  },
  {
    value: "metroidvania",
    image: "/images/metroidvania.png",
    label: "ميترودفانيا",
    description: "استكشاف جانبي مع قدرات تفتح مناطق جديدة تدريجياً",
  },
  {
    value: "roguelike",
    image: "/images/roguelike.png",
    label: "روغ لايك",
    description: "عشوائية كاملة، كل محاولة مختلفة، تحديات متكررة",
  },
];

interface Step1GenreProps {
  genrePref: string | null;
  setGenre: (value: string) => void;
}

export default function Step1Genre({ genrePref, setGenre }: Step1GenreProps) {
  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
        <GlowText color="purple">ما نوع الألعاب المفضل لديك؟</GlowText>
      </h2>
      <p className="text-slate-400 mb-6">
        اختر النمط الذي يناسب أسلوبك في اللعب
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {OPTIONS.map((opt) => (
          <SelectTile
            key={opt.value}
            image={opt.image}
            label={opt.label}
            description={opt.description}
            selected={genrePref === opt.value}
            onClick={() => setGenre(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}
