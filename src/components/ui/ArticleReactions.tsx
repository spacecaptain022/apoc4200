"use client";

import { useState, useEffect, useCallback } from "react";
import { EMOJIS, type ReactionEmoji, type ReactionCounts } from "@/app/api/reactions/route";

type Props = { articleId: string };

const STORAGE_KEY = "nc_reactions";

function getUserReactions(): Record<string, ReactionEmoji[]> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}"); } catch { return {}; }
}

function toggleStored(articleId: string, emoji: ReactionEmoji, add: boolean) {
  const all = getUserReactions();
  const current = all[articleId] ?? [];
  all[articleId] = add
    ? [...new Set([...current, emoji])]
    : current.filter((e) => e !== emoji);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function ArticleReactions({ articleId }: Props) {
  const [counts,   setCounts]   = useState<ReactionCounts>({ "💀": 0, "🔥": 0 });
  const [myReacts, setMyReacts] = useState<ReactionEmoji[]>([]);
  const [busy,     setBusy]     = useState(false);

  useEffect(() => {
    setMyReacts(getUserReactions()[articleId] ?? []);
    fetch(`/api/reactions?ids=${articleId}`)
      .then((r) => r.json())
      .then((d) => { if (d[articleId]) setCounts(d[articleId]); })
      .catch(() => {});
  }, [articleId]);

  const react = useCallback(async (emoji: ReactionEmoji) => {
    if (busy) return;
    const already = myReacts.includes(emoji);

    // Optimistic
    setCounts((prev) => ({ ...prev, [emoji]: Math.max(0, prev[emoji] + (already ? -1 : 1)) }));
    const next = already ? myReacts.filter((e) => e !== emoji) : [...myReacts, emoji];
    setMyReacts(next);
    toggleStored(articleId, emoji, !already);

    if (!already) {
      setBusy(true);
      try {
        const res = await fetch("/api/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ articleId, emoji }),
        });
        if (res.ok) setCounts(await res.json());
      } catch {}
      setBusy(false);
    }
  }, [articleId, myReacts, busy]);

  const total = counts["💀"] + counts["🔥"];

  return (
    <div
      className="flex items-center gap-2 pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      {EMOJIS.map((emoji) => {
        const active = myReacts.includes(emoji);
        const count  = counts[emoji];
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => react(emoji)}
            className="flex items-center gap-1.5 border px-2.5 py-1 transition-all duration-150 active:scale-95"
            style={{
              borderColor:     active ? (emoji === "🔥" ? "var(--signal-amber)" : "var(--signal-cyan)") : "var(--border-subtle)",
              backgroundColor: active ? (emoji === "🔥" ? "rgba(255,176,0,0.1)" : "rgba(0,229,255,0.08)") : "var(--bg-elevated)",
              borderRadius:    "var(--radius-sm)",
            }}
            title={active ? "Remove reaction" : "React"}
          >
            <span style={{ fontSize: "13px", lineHeight: 1 }}>{emoji}</span>
            <span
              className="font-broadcast text-[11px] tabular-nums"
              style={{
                color:      active ? (emoji === "🔥" ? "var(--signal-amber)" : "var(--signal-cyan)") : "var(--text-secondary)",
                minWidth:   "14px",
                textAlign:  "right",
              }}
            >
              {count}
            </span>
          </button>
        );
      })}

      {total > 0 && (
        <span
          className="font-data text-[9px] uppercase tracking-[0.08em]"
          style={{ color: "var(--text-muted)" }}
        >
          {total} reaction{total !== 1 ? "s" : ""}
        </span>
      )}
    </div>
  );
}
