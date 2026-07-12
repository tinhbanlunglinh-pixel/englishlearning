import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface StarPopNotificationProps {
  showStarPopEffect: boolean;
  dailyStars: number;
}

export const StarPopNotification: React.FC<StarPopNotificationProps> = ({ showStarPopEffect, dailyStars }) => (
  <AnimatePresence>
    {showStarPopEffect && (
      <motion.div
        initial={{ scale: 0.5, y: 30, opacity: 0 }}
        animate={{ scale: 1.3, y: -20, opacity: 1 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-white font-black px-6 py-3 rounded-full flex items-center gap-2 shadow-lg border-2 border-yellow-300"
      >
        <span className="text-2xl">⭐</span>
        <span>Bé nhận được Sao Vàng Chăm Chỉ! (Hôm nay: {dailyStars} ⭐)</span>
      </motion.div>
    )}
  </AnimatePresence>
);
