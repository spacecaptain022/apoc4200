"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";
import { DataLabel } from "@/components/ui/DataLabel";
import { Timestamp } from "@/components/ui/Timestamp";
import { FEEDS, CATEGORIES, type LiveFeed, type FeedCategory } from "@/app/api/feeds/route";

const CYCLE_MS = 6000;

export function RotatingSignalWindow() {
  const [activeCategory, setActiveCategory] = useState<FeedCategory>("markets");
  const [feedIndex, setFeedIndex]           = useState(0);
  const [switching, setSwitching]           = useState(false);
  const [progress, setProgress]             = useState(0);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const feedsForCategory = FEEDS.filter((f) => f.category === activeCategory);
  const currentFeed: LiveFeed | undefined = feedsForCategory[feedIndex];

  const startTimers = useCallback((onTick: () => void) => {
    if (timerRef.current)    clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    timerRef.current    = setInterval(onTick, CYCLE_MS);
    progressRef.current = setInterval(
      () => setProgress((p) => Math.min(p + 100 / (CYCLE_MS / 100), 100)),
      100
    );
  }, []);

  const advance = useCallback(() => {
    setSwitching(true);
    setTimeout(() => {
      setFeedIndex((i) => (i + 1) % feedsForCategory.length);
      setSwitching(false);
      setProgress(0);
    }, 400);
  }, [feedsForCategory.length]);

  useEffect(() => {
    setFeedIndex(0);
    setProgress(0);
    setSwitching(false);
    startTimers(advance);
    return () => {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeCategory, advance, startTimers]);

  const handleDotClick = (idx: number) => {
    if (idx === feedIndex) return;
    setSwitching(true);
    setTimeout(() => {
      setFeedIndex(idx);
      setSwitching(false);
      setProgress(0);
      startTimers(advance);
    }, 400);
  };

  const catMeta     = CATEGORIES.find((c) => c.id === activeCategory);
  const accentColor = currentFeed?.accentColor ?? catMeta?.color ?? "var(--signal-green)";

  const embedUrl = currentFeed
    ? `https://www.youtube.com/embed/live_stream?channel=${currentFeed.channelId}&autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative w-full"
    >
      <CornerMarkers color={accentColor}>
        <div
          className="relative overflow-hidden"
          style={{
            border: "1px solid var(--border-default)",
            backgroundColor: "var(--bg-panel)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between gap-2 border-b px-2 py-1.5 sm:px-3"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="blink inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <DataLabel className="!text-[var(--text-secondary)] truncate">
                {currentFeed?.label ?? "SCANNING"}
              </DataLabel>
            </div>
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <DataLabel>{feedIndex + 1}/{feedsForCategory.length}</DataLabel>
              <Timestamp className="hidden sm:inline" />
            </div>
          </div>

          {/* Video */}
          <div className="relative" style={{ aspectRatio: "16/9", backgroundColor: "#000" }}>
            <AnimatePresence>
              {switching && (
                <motion.div
                  key="switch"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1.5"
                  style={{ backgroundColor: "var(--bg-base)" }}
                >
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="w-full"
                      style={{
                        height: 3,
                        backgroundColor: accentColor,
                        opacity: Math.random() * 0.6 + 0.1,
                        transform: `translateX(${(Math.random() - 0.5) * 20}%)`,
                      }}
                    />
                  ))}
                  <DataLabel className="mt-2">SWITCHING SIGNAL</DataLabel>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {embedUrl && !switching && (
                <motion.iframe
                  key={`${activeCategory}-${feedIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  src={embedUrl}
                  className="absolute inset-0 h-full w-full"
                  allow="autoplay; encrypted-media"
                  style={{ border: "none" }}
                  title={currentFeed?.label}
                />
              )}
            </AnimatePresence>

            {/* Scanlines */}
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
              }}
            />
            {/* Vignette */}
            <div
              className="pointer-events-none absolute inset-0 z-10"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)",
              }}
            />
          </div>

          {/* Progress bar */}
          <div className="relative h-0.5 w-full" style={{ backgroundColor: "var(--border-subtle)" }}>
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: accentColor,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Footer */}
          <div
            className="flex flex-col gap-2 border-t px-2 py-2 sm:px-3"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
          >
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1">
              {CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategory;
                const count    = FEEDS.filter((f) => f.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="border px-1.5 py-0.5 font-data text-[8px] uppercase tracking-[0.08em] transition-all duration-150 sm:px-2 sm:text-[9px] sm:tracking-[0.1em]"
                    style={{
                      borderColor:     isActive ? cat.color : "var(--border-subtle)",
                      color:           isActive ? cat.color : "var(--text-muted)",
                      backgroundColor: isActive ? `${cat.color}12` : "transparent",
                    }}
                  >
                    {cat.label}
                    <span className="ml-1 opacity-50">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Sublabel + dot nav */}
            <div className="flex items-center justify-between gap-2">
              <DataLabel className="min-w-0 truncate">{currentFeed?.sublabel ?? ""}</DataLabel>
              <div className="flex shrink-0 items-center gap-1.5">
                {feedsForCategory.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className="transition-all duration-200"
                    style={{
                      width:           i === feedIndex ? 14 : 5,
                      height:          4,
                      borderRadius:    2,
                      backgroundColor: i === feedIndex ? accentColor : "var(--border-strong)",
                    }}
                    aria-label={`Feed ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CornerMarkers>
    </motion.div>
  );
}
