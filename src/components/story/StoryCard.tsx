"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { NarrativeTag } from "./NarrativeTag";
import { CornerMarkers } from "@/components/ui/CornerMarkers";

export type StoryCardData = {
  title: string;
  dek?: string;
  slug: string;
  category: string;
  urgency?: "breaking" | "developing" | "analysis" | "default";
  publishedAt: string;
  mediaUrl?: string;
};

type StoryCardProps = {
  story: StoryCardData;
  variant?: "lead" | "secondary";
  delay?: number;
};

export function StoryCard({ story, variant = "secondary", delay = 0 }: StoryCardProps) {
  const isLead = variant === "lead";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay }}
    >
      <Link href={`/news/${story.slug}`} className="group block">
        <CornerMarkers color="var(--border-default)">
          <div
            className="transition-colors duration-200"
            style={{
              border: "1px solid var(--border-default)",
              backgroundColor: "var(--bg-panel)",
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
            }}
          >
            {/* Media area */}
            <div
              className="relative overflow-hidden"
              style={{
                backgroundColor: "var(--bg-elevated)",
                aspectRatio: isLead ? "16/8" : "16/9",
              }}
            >
              {story.mediaUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={story.mediaUrl}
                  alt={story.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ minHeight: isLead ? 200 : 140 }}
                >
                  <span
                    className="font-data text-[9px] uppercase tracking-[0.12em]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    NO SIGNAL
                  </span>
                </div>
              )}
              {/* Scanline on media */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
                }}
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 p-3">
              <div className="flex items-center gap-2">
                <NarrativeTag label={story.category} urgency={story.urgency} />
                <span
                  className="font-data text-[9px] tabular-nums"
                  style={{ color: "var(--text-muted)" }}
                >
                  {story.publishedAt}
                </span>
              </div>
              <h3
                className={`font-broadcast leading-tight tracking-[0.04em] transition-colors duration-150 group-hover:text-[var(--signal-green)] ${isLead ? "text-2xl" : "text-base"}`}
                style={{ color: "var(--text-primary)" }}
              >
                {story.title}
              </h3>
              {story.dek && isLead && (
                <p
                  className="font-data text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {story.dek}
                </p>
              )}
            </div>
          </div>
        </CornerMarkers>
      </Link>
    </motion.div>
  );
}
