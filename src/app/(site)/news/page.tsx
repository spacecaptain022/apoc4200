"use client";

import { useState, useEffect, useCallback } from "react";
import { BroadcastShell } from "@/components/layout/BroadcastShell";
import { NarrativeTag } from "@/components/story/NarrativeTag";
import { SectionFrame } from "@/components/layout/SectionFrame";
import type { NewsArticle, NewsCategory } from "@/app/api/news/route";

const CATEGORIES: { id: NewsCategory | "ALL"; label: string; color: string }[] = [
  { id: "ALL",        label: "ALL",        color: "var(--text-secondary)" },
  { id: "CRYPTO",     label: "CRYPTO",     color: "var(--signal-green)"   },
  { id: "MARKETS",    label: "MARKETS",    color: "var(--signal-cyan)"    },
  { id: "GEOPOLITICS",label: "GEOPOLITICS",color: "var(--signal-amber)"   },
  { id: "MACRO",      label: "MACRO",      color: "var(--signal-red)"     },
  { id: "GLOBAL",     label: "GLOBAL",     color: "var(--text-secondary)" },
];

function timeAgo(ms: number): string {
  const age = Date.now() - ms;
  const mins = Math.floor(age / 60_000);
  const hours = Math.floor(mins / 60);
  if (mins < 1) return "JUST NOW";
  if (mins < 60) return `${mins}M AGO`;
  if (hours < 24) return `${hours}H AGO`;
  return "YESTERDAY";
}

function NewsCard({ article, featured }: { article: NewsArticle; featured?: boolean }) {
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block h-full"
    >
      <div
        className="h-full flex flex-col transition-colors duration-200"
        style={{
          border: "1px solid var(--border-default)",
          backgroundColor: "var(--bg-panel)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        {/* Media */}
        {article.mediaUrl && (
          <div
            className="relative overflow-hidden flex-shrink-0"
            style={{ aspectRatio: featured ? "16/7" : "16/9" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.mediaUrl}
              alt={article.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(to bottom,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-2 p-3 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <NarrativeTag label={article.category} urgency={article.urgency} />
            <span className="font-data text-[9px]" style={{ color: "var(--text-muted)" }}>
              {timeAgo(article.publishedMs)}
            </span>
            <span
              className="font-data text-[9px] tracking-[0.06em] uppercase"
              style={{ color: "var(--text-muted)", opacity: 0.6 }}
            >
              · {article.source}
            </span>
          </div>

          <h3
            className={`font-broadcast leading-tight tracking-[0.04em] transition-colors duration-150 group-hover:text-[var(--signal-green)] ${featured ? "text-xl" : "text-sm"}`}
            style={{ color: "var(--text-primary)" }}
          >
            {article.title}
          </h3>

          {featured && article.description && (
            <p
              className="font-data text-xs leading-relaxed line-clamp-3"
              style={{ color: "var(--text-secondary)" }}
            >
              {article.description}
            </p>
          )}

          <div className="mt-auto pt-2">
            <span
              className="font-data text-[9px] tracking-[0.1em] uppercase transition-colors duration-150 group-hover:text-[var(--signal-green)]"
              style={{ color: "var(--text-muted)" }}
            >
              READ FULL STORY →
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "ALL">("ALL");
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/news");
      if (!res.ok) return;
      const data = await res.json();
      setArticles(data.articles ?? []);
      setFetchedAt(data.fetchedAt ?? Date.now());
    } catch {
      // keep existing
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, 5 * 60_000);
    return () => clearInterval(id);
  }, [load]);

  const filtered =
    activeCategory === "ALL"
      ? articles
      : articles.filter((a) => a.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <BroadcastShell>
      <div className="mx-auto max-w-[1440px] px-4 py-10">
        {/* Header */}
        <div
          className="mb-6 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div>
            <span
              className="font-broadcast text-3xl tracking-[0.1em]"
              style={{ color: "var(--text-primary)" }}
            >
              LIVE FEED
            </span>
            <p
              className="mt-1 font-data text-[11px] tracking-[0.08em]"
              style={{ color: "var(--text-muted)" }}
            >
              GLOBAL NEWS · REAL-TIME · AUTO-REFRESH EVERY 5 MIN
            </p>
          </div>

          <div className="flex items-center gap-3">
            {fetchedAt && (
              <span
                className="font-data text-[10px] tracking-[0.08em]"
                style={{ color: "var(--text-muted)" }}
              >
                UPDATED {timeAgo(fetchedAt)}
              </span>
            )}
            <span
              className="blink inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--signal-green)" }}
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="font-data text-[10px] tracking-[0.1em] uppercase border px-3 py-1.5 transition-all duration-150"
                style={{
                  borderColor: active ? cat.color : "var(--border-default)",
                  color: active ? cat.color : "var(--text-muted)",
                  backgroundColor: active ? `color-mix(in srgb, ${cat.color} 10%, transparent)` : "transparent",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Feed */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <span
              className="font-broadcast text-xl tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
            >
              ACQUIRING SIGNAL...
            </span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <span
              className="font-broadcast text-xl tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
            >
              NO SIGNAL IN THIS BAND
            </span>
          </div>
        ) : (
          <SectionFrame label={`${filtered.length} STORIES · ${activeCategory}`}>
            <div className="grid gap-4 md:grid-cols-12">
              {/* Featured */}
              {featured && (
                <div className="md:col-span-7 lg:col-span-8">
                  <NewsCard article={featured} featured />
                </div>
              )}

              {/* Secondary stack */}
              <div className="flex flex-col gap-4 md:col-span-5 lg:col-span-4">
                {rest.slice(0, 3).map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>

              {/* Grid */}
              {rest.slice(3).map((a) => (
                <div key={a.id} className="md:col-span-4 lg:col-span-3">
                  <NewsCard article={a} />
                </div>
              ))}
            </div>
          </SectionFrame>
        )}
      </div>
    </BroadcastShell>
  );
}
