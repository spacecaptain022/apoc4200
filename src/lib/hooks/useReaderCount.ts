"use client";

import { useState, useEffect } from "react";

// Seeded from current minute so it's consistent per-minute across page loads
function baseCount(): number {
  const seed = Math.floor(Date.now() / 60_000); // changes every minute
  // Deterministic-ish number in range 80–260 using the seed
  const pseudo = ((seed * 1103515245 + 12345) & 0x7fffffff) % 181;
  return 80 + pseudo;
}

export function useReaderCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    setCount(baseCount());

    const id = setInterval(() => {
      setCount((prev) => {
        if (prev === null) return baseCount();
        // Random walk ±1–8
        const delta = Math.floor(Math.random() * 8) - 3;
        return Math.max(40, Math.min(400, prev + delta));
      });
    }, 8_000);

    return () => clearInterval(id);
  }, []);

  return count;
}
