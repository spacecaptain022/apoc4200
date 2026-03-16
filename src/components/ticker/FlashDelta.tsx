"use client";

import { useEffect, useRef, useState } from "react";
import { changeColor } from "@/lib/formatting/prices";

type FlashDeltaProps = {
  value: number;
  display: string;
  className?: string;
};

export function FlashDelta({ value, display, className = "" }: FlashDeltaProps) {
  const prev = useRef(value);
  const [flash, setFlash] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    if (value === prev.current) return;
    setFlash(value > prev.current ? "up" : "down");
    prev.current = value;
    const t = setTimeout(() => setFlash(null), 700);
    return () => clearTimeout(t);
  }, [value]);

  const baseColor = changeColor(value);
  const flashColor =
    flash === "up" ? "var(--signal-green)" : flash === "down" ? "var(--signal-red)" : baseColor;

  return (
    <span
      className={`tabular-nums transition-colors duration-300 ${className}`}
      style={{ color: flashColor }}
    >
      {display}
    </span>
  );
}
