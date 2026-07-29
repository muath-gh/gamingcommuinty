"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SelectTileProps {
  image: string;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

export default function SelectTile({
  image,
  label,
  description,
  selected,
  onClick,
}: SelectTileProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        "relative w-full text-right rounded-2xl p-5 sm:p-6 transition-colors duration-200 overflow-hidden min-h-48 flex flex-col justify-end",
        selected
          ? "glow-border-blue"
          : "border border-white/10 hover:border-neon-purple/50",
      )}
    >
      {/* الصورة كـ background */}
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover absolute inset-0"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* النص فوق الصورة */}
      <div className="relative z-10">
        <div className="font-bold text-lg sm:text-xl mb-1">{label}</div>
        {description && (
          <div className="text-sm text-white/80 leading-relaxed">
            {description}
          </div>
        )}
      </div>

      {/* Checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 left-3 z-20 h-6 w-6 rounded-full bg-neon-blue/20 border border-neon-blue flex items-center justify-center text-neon-blue text-sm"
        >
          ✓
        </motion.div>
      )}
    </motion.button>
  );
}
