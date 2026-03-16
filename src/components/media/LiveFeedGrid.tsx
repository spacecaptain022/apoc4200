"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Radio } from "lucide-react";
import { LiveFeedWindow } from "./LiveFeedWindow";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { DataLabel } from "@/components/ui/DataLabel";
import type { LiveFeed } from "@/app/api/feeds/route";

const BIAS_LABELS: Record<LiveFeed["bias"], string> = {
  mainstream:    "MAINSTREAM",
  alternative:   "ALTERNATIVE",
  international: "INTERNATIONAL",
  crypto:        "CRYPTO",
  hostile:       "HOSTILE",
};

const BIAS_COLORS: Record<LiveFeed["bias"], string> = {
  mainstream:    "var(--signal-cyan)",
  alternative:   "var(--signal-amber)",
  international: "var(--signal-green)",
  crypto:        "var(--signal-magenta)",
  hostile:       "var(--signal-red)",
};

export function LiveFeedGrid() {
  const [feeds, setFeeds]           = useState<LiveFeed[]>([]);
  const [focusedId, setFocusedId]   = useState<string | null>(null);
  const [filter, setFilter]         = useState<LiveFeed["bias"] | "all">("all");
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    fetch("/api/feeds")
      .then((r) => r.json())
      .then((d) => {
        setFeeds(d.feeds ?? []);
        setFocusedId(d.feeds?.[0]?.id ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredFeeds =
    filter === "all" ? feeds : feeds.filter((f) => f.bias === filter);

  const focusedFeed = feeds.find((f) => f.id === focusedId) ?? feeds[0];
  const sidePanelFeeds = filteredFeeds.filter((f) => f.id !== focusedFeed?.id);

  const biasOptions = Array.from(new Set(feeds.map((f) => f.bias)));

  if (loading) {
    return (
      <SectionFrame label="INTERCEPTED TRANSMISSIONS">
        <div
          className="flex h-40 items-center justify-center gap-3"
          style={{ border: "1px solid var(--border-subtle)" }}
        >
          <Radio size={16} className="blink" style={{ color: "var(--signal-green)" }} />
          <DataLabel>SCANNING FEEDS</DataLabel>
        </div>
      </SectionFrame>
    );
  }

  return (
    <SectionFrame label="INTERCEPTED TRANSMISSIONS">
      {/* Filter bar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className="border px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-colors duration-150"
          style={{
            borderColor: filter === "all" ? "var(--signal-green)" : "var(--border-subtle)",
            color: filter === "all" ? "var(--signal-green)" : "var(--text-muted)",
            backgroundColor: filter === "all" ? "rgba(92,255,92,0.06)" : "transparent",
          }}
        >
          ALL FEEDS
        </button>
        {biasOptions.map((bias) => (
          <button
            key={bias}
            onClick={() => setFilter(bias)}
            className="border px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-colors duration-150"
            style={{
              borderColor: filter === bias ? BIAS_COLORS[bias] : "var(--border-subtle)",
              color: filter === bias ? BIAS_COLORS[bias] : "var(--text-muted)",
              backgroundColor: filter === bias ? `${BIAS_COLORS[bias]}10` : "transparent",
            }}
          >
            {BIAS_LABELS[bias]}
          </button>
        ))}
      </div>

      {/* Grid: large primary + side panel */}
      <div className="grid gap-3 lg:grid-cols-12">
        {/* Primary / focused feed */}
        {focusedFeed && (
          <motion.div
            layout
            className="lg:col-span-8"
            transition={{ duration: 0.3 }}
          >
            <LiveFeedWindow
              feed={focusedFeed}
              isFocused
              onFocus={() => setFocusedId(focusedFeed.id)}
            />
          </motion.div>
        )}

        {/* Side panel — smaller feeds */}
        <div className="flex flex-col gap-3 lg:col-span-4">
          {sidePanelFeeds.slice(0, 3).map((feed) => (
            <motion.div key={feed.id} layout transition={{ duration: 0.3 }}>
              <LiveFeedWindow
                feed={feed}
                isFocused={false}
                onFocus={() => setFocusedId(feed.id)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom row — any extra feeds */}
      {sidePanelFeeds.length > 3 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sidePanelFeeds.slice(3).map((feed) => (
            <motion.div key={feed.id} layout transition={{ duration: 0.3 }}>
              <LiveFeedWindow
                feed={feed}
                isFocused={false}
                onFocus={() => setFocusedId(feed.id)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}
