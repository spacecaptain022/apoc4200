"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

type Props = {
  count: number;
  onRefresh: () => void;
};

export function NewSignalsToast({ count, onRefresh }: Props) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2"
        >
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 border px-4 py-2 font-data text-[11px] uppercase tracking-[0.12em] shadow-lg transition-all duration-150 hover:scale-105"
            style={{
              borderColor:     "var(--signal-green)",
              color:           "var(--signal-green)",
              backgroundColor: "var(--bg-elevated)",
              borderRadius:    "var(--radius-md)",
              boxShadow:       "0 0 20px rgba(92,255,92,0.2), 0 4px 24px rgba(0,0,0,0.5)",
            }}
          >
            <ArrowUp size={11} strokeWidth={2.5} />
            {count} NEW SIGNAL{count !== 1 ? "S" : ""} — CLICK TO LOAD
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
