"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Radio } from "lucide-react";
import { LiveFeedWindow } from "./LiveFeedWindow";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { DataLabel } from "@/components/ui/DataLabel";
import { CATEGORIES } from "@/app/api/feeds/route";
import type { LiveFeed, FeedCategory } from "@/app/api/feeds/route";

export function LiveFeedGrid() {
  const [feeds, setFeeds]         = useState<LiveFeed[]>([]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [filter, setFilter]       = useState<FeedCategory | "all">("all");
  const [loading, setLoading]     = useState(true);

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
    filter === "all" ? feeds : feeds.filter((f) => f.category === filter);

  const focusedFeed   = filteredFeeds.find((f) => f.id === focusedId) ?? filteredFeeds[0];
  const sidePanelFeeds = filteredFeeds.filter((f) => f.id !== focusedFeed?.id);

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
          onClick={() => { setFilter("all"); setFocusedId(feeds[0]?.id ?? null); }}
          className="border px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-colors duration-150"
          style={{
            borderColor: filter === "all" ? "var(--signal-green)" : "var(--border-subtle)",
            color:       filter === "all" ? "var(--signal-green)" : "var(--text-muted)",
            backgroundColor: filter === "all" ? "rgba(92,255,92,0.06)" : "transparent",
          }}
        >
          ALL ({feeds.length})
        </button>
        {CATEGORIES.map((cat) => {
          const count = feeds.filter((f) => f.category === cat.id).length;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setFilter(cat.id);
                const first = feeds.find((f) => f.category === cat.id);
                setFocusedId(first?.id ?? null);
              }}
              className="border px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-colors duration-150"
              style={{
                borderColor:     isActive ? cat.color : "var(--border-subtle)",
                color:           isActive ? cat.color : "var(--text-muted)",
                backgroundColor: isActive ? `${cat.color}10` : "transparent",
              }}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid: large primary + side panel */}
      <div className="grid gap-3 lg:grid-cols-12">
        {focusedFeed && (
          <motion.div layout className="lg:col-span-8" transition={{ duration: 0.3 }}>
            <LiveFeedWindow feed={focusedFeed} isFocused onFocus={() => setFocusedId(focusedFeed.id)} />
          </motion.div>
        )}

        <div className="flex flex-col gap-3 lg:col-span-4">
          {sidePanelFeeds.slice(0, 3).map((feed) => (
            <motion.div key={feed.id} layout transition={{ duration: 0.3 }}>
              <LiveFeedWindow feed={feed} isFocused={false} onFocus={() => setFocusedId(feed.id)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Overflow feeds */}
      {sidePanelFeeds.length > 3 && (
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sidePanelFeeds.slice(3).map((feed) => (
            <motion.div key={feed.id} layout transition={{ duration: 0.3 }}>
              <LiveFeedWindow feed={feed} isFocused={false} onFocus={() => setFocusedId(feed.id)} />
            </motion.div>
          ))}
        </div>
      )}
    </SectionFrame>
  );
}
