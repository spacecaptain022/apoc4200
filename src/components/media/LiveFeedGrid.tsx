"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { Radio } from "lucide-react";
import { LiveFeedWindow } from "./LiveFeedWindow";
import { SectionFrame } from "@/components/layout/SectionFrame";
import { DataLabel } from "@/components/ui/DataLabel";
import { CATEGORIES } from "@/app/api/feeds/route";
import type { LiveFeed, FeedCategory } from "@/app/api/feeds/route";
import type { LiveStatus } from "@/app/api/live-status/route";

export function LiveFeedGrid() {
  const [feeds, setFeeds]           = useState<LiveFeed[]>([]);
  const [statuses, setStatuses]     = useState<Record<string, string | null>>({});
  const [focusedId, setFocusedId]   = useState<string | null>(null);
  const [filter, setFilter]         = useState<FeedCategory | "all">("all");
  const [loading, setLoading]       = useState(true);

  // Load feed list once
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

  // Poll live status every 3 min
  const pollLiveStatus = useCallback(async () => {
    try {
      const r = await fetch("/api/live-status");
      if (!r.ok) return;
      const d = await r.json();
      const map: Record<string, string | null> = {};
      for (const s of (d.statuses as LiveStatus[])) {
        map[s.feedId] = s.videoId;
      }
      setStatuses(map);
    } catch {
      // keep previous statuses
    }
  }, []);

  useEffect(() => {
    if (feeds.length === 0) return;
    pollLiveStatus();
    const id = setInterval(pollLiveStatus, 3 * 60_000);
    return () => clearInterval(id);
  }, [feeds.length, pollLiveStatus]);

  // ── Filtering ──────────────────────────────────────────────────────────────
  const filteredFeeds  = filter === "all" ? feeds : feeds.filter((f) => f.category === filter);

  // Prefer focused feed that actually has a live stream
  const liveFirst = [...filteredFeeds].sort((a, b) => {
    const aLive = statuses[a.id] != null ? 1 : 0;
    const bLive = statuses[b.id] != null ? 1 : 0;
    return bLive - aLive;
  });

  const focusedFeed    = liveFirst.find((f) => f.id === focusedId) ?? liveFirst[0];
  const sidePanelFeeds = liveFirst.filter((f) => f.id !== focusedFeed?.id);

  const liveCount = filteredFeeds.filter((f) => statuses[f.id] != null).length;

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
      <div className="mb-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <button
          onClick={() => { setFilter("all"); setFocusedId(liveFirst[0]?.id ?? null); }}
          className="border px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-colors duration-150"
          style={{
            borderColor:     filter === "all" ? "var(--signal-green)" : "var(--border-subtle)",
            color:           filter === "all" ? "var(--signal-green)" : "var(--text-muted)",
            backgroundColor: filter === "all" ? "rgba(92,255,92,0.06)" : "transparent",
          }}
        >
          ALL ({feeds.length})
          {liveCount > 0 && (
            <span style={{ color: "var(--signal-green)", marginLeft: 4 }}>
              · {liveCount} LIVE
            </span>
          )}
        </button>

        {CATEGORIES.map((cat) => {
          const total   = feeds.filter((f) => f.category === cat.id).length;
          const live    = feeds.filter((f) => f.category === cat.id && statuses[f.id] != null).length;
          const isActive = filter === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setFilter(cat.id);
                const first = liveFirst.find((f) => f.category === cat.id);
                setFocusedId(first?.id ?? null);
              }}
              className="border px-2 py-1 font-data text-[9px] uppercase tracking-[0.1em] transition-colors duration-150"
              style={{
                borderColor:     isActive ? cat.color : "var(--border-subtle)",
                color:           isActive ? cat.color : "var(--text-muted)",
                backgroundColor: isActive ? `${cat.color}10` : "transparent",
              }}
            >
              {cat.label} {live > 0 ? `${live}/${total}` : total}
            </button>
          );
        })}
      </div>

      {/* Primary feed */}
      {focusedFeed && (
        <div className="grid gap-3 lg:grid-cols-12">
          <motion.div layout className="lg:col-span-8" transition={{ duration: 0.3 }}>
            <LiveFeedWindow
              feed={focusedFeed}
              resolvedVideoId={statuses[focusedFeed.id] ?? null}
              isFocused
              onFocus={() => setFocusedId(focusedFeed.id)}
            />
          </motion.div>

          <div className="hidden flex-col gap-3 lg:col-span-4 lg:flex">
            {sidePanelFeeds.slice(0, 3).map((feed) => (
              <motion.div key={feed.id} layout transition={{ duration: 0.3 }}>
                <LiveFeedWindow
                  feed={feed}
                  resolvedVideoId={statuses[feed.id] ?? null}
                  isFocused={false}
                  onFocus={() => setFocusedId(feed.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile scroll row */}
      {sidePanelFeeds.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden">
          {sidePanelFeeds.map((feed) => {
            const isLive = statuses[feed.id] != null;
            return (
              <button
                key={feed.id}
                onClick={() => setFocusedId(feed.id)}
                className="shrink-0 border px-3 py-1.5 font-data text-[9px] uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor:     isLive ? feed.accentColor : "var(--border-subtle)",
                  color:           isLive ? "var(--text-secondary)" : "var(--text-muted)",
                  backgroundColor: "var(--bg-panel)",
                }}
              >
                <span
                  className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${isLive ? "blink" : ""}`}
                  style={{ backgroundColor: isLive ? feed.accentColor : "var(--border-default)" }}
                />
                {feed.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Desktop overflow grid */}
      {sidePanelFeeds.length > 3 && (
        <div className="mt-3 hidden gap-3 sm:grid-cols-2 lg:grid lg:grid-cols-3">
          {sidePanelFeeds.slice(3).map((feed) => (
            <motion.div key={feed.id} layout transition={{ duration: 0.3 }}>
              <LiveFeedWindow
                feed={feed}
                resolvedVideoId={statuses[feed.id] ?? null}
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
