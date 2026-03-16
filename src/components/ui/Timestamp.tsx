"use client";

import { useEffect, useState } from "react";

type TimestampProps = {
  className?: string;
  showDate?: boolean;
};

export function Timestamp({ className = "", showDate = false }: TimestampProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const t = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const d = now.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      });
      setTime(showDate ? `${d} ${t}` : t);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [showDate]);

  return (
    <span className={`font-data text-[11px] text-[var(--text-muted)] tabular-nums ${className}`}>
      {time}
    </span>
  );
}
