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
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const feedsForCategory = FEEDS.filter((f) => f.category === activeCategory);
  const currentFeed: LiveFeed | undefined = feedsForCategory[feedIndex];

  const advance = useCallback(() => {
    setSwitching(true);
    setTimeout(() => {
      setFeedIndex((i) => (i + 1) % feedsForCategory.length);
      setSwitching(false);
      setProgress(0);
    }, 400);
  }, [feedsForCategory.length]);

  // Restart cycle whenever category or advance changes
  useEffect(() => {
    setFeedIndex(0);
    setProgress(0);
    setSwitching(false);

    if (timerRef.current)    clearInterval(timerRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    timerRef.current    = setInterval(advance, CYCLE_MS);
    progressRef.current = setInterval(
      () => setProgress((p) => Math.min(p + 100 / (CYCLE_MS / 100), 100)),
      100
    );

    return () => {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [activeCategory, advance]);

  const handleCategoryClick = (cat: FeedCategory) => {
    if (cat === activeCategory) return;
    setActiveCategory(cat);
  };

  const handleDotClick = (idx: number) => {
    if (idx === feedIndex) return;
    setSwitching(true);
    setTimeout(() => {
      setFeedIndex(idx);
      setSwitching(false);
      setProgress(0);
      // Reset timer
      if (timerRef.current)    clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      timerRef.current    = setInterval(advance, CYCLE_MS);
      progressRef.current = setInterval(
        () => setProgress((p) => Math.min(p + 100 / (CYCLE_MS / 100), 100)),
        100
      );
    }, 400);
  };

  const catMeta = CATEGORIES.find((c) => c.id === activeCategory);
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
            border: `1px solid var(--border-default)`,
            backgroundColor: "var(--bg-panel)",
          }}
        >
          {/* Header bar */}
          <div
            className="flex items-center justify-between border-b px-3 py-1.5"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
          >
            <div className="flex items-center gap-2">
              <span
                className="blink inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <DataLabel className="!text-[var(--text-secondary)]">
                {currentFeed?.label ?? "SCANNING"}
              </DataLabel>
            </div>
            <div className="flex items-center gap-3">
              <DataLabel>
                {feedIndex + 1}/{feedsForCategory.length}
              </DataLabel>
              <Timestamp />
            </div>
          </div>

          {/* Video area */}
          <div className="relative" style={{ aspectRatio: "16/10", backgroundColor: "#000" }}>
            {/* Switching overlay */}
            <AnimatePresence>
              {switching && (
                <motion.div
                  key="switch"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2"
                  style={{ backgroundColor: "var(--bg-base)" }}
                >
                  {/* Static noise bars */}
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

            {/* Iframe */}
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
          <div
            className="relative h-0.5 w-full overflow-hidden"
            style={{ backgroundColor: "var(--border-subtle)" }}
          >
            <motion.div
              className="h-full"
              style={{
                width: `${progress}%`,
                backgroundColor: accentColor,
                transition: "width 0.1s linear",
              }}
            />
          </div>

          {/* Footer — categories + feed dots */}
          <div
            className="flex flex-col gap-2 border-t px-3 py-2"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
          >
            {/* Category tabs */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => {
                const isActive = cat.id === activeCategory;
                const count = FEEDS.filter((f) => f.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.1em] transition-all duration-150"
                    style={{
                      borderColor: isActive ? cat.color : "var(--border-subtle)",
                      color: isActive ? cat.color : "var(--text-muted)",
                      backgroundColor: isActive ? `${cat.color}12` : "transparent",
                    }}
                  >
                    {cat.label}
                    <span
                      className="ml-1 opacity-50"
                      style={{ color: isActive ? cat.color : "var(--text-muted)" }}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feed dots + sublabel */}
            <div className="flex items-center justify-between">
              <DataLabel>{currentFeed?.sublabel ?? ""}</DataLabel>
              <div className="flex items-center gap-1.5">
                {feedsForCategory.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleDotClick(i)}
                    className="transition-all duration-200"
                    style={{
                      width: i === feedIndex ? 14 : 5,
                      height: 4,
                      borderRadius: 2,
                      backgroundColor:
                        i === feedIndex ? accentColor : "var(--border-strong)",
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
