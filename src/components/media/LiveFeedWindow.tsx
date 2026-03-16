"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX, Maximize2, Radio } from "lucide-react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";
import { DataLabel } from "@/components/ui/DataLabel";
import { Timestamp } from "@/components/ui/Timestamp";
import type { LiveFeed } from "@/app/api/feeds/route";

type LiveFeedWindowProps = {
  feed: LiveFeed;
  isFocused?: boolean;
  onFocus?: () => void;
};

export function LiveFeedWindow({ feed, isFocused = false, onFocus }: LiveFeedWindowProps) {
  const [muted, setMuted] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const embedUrl =
    `https://www.youtube.com/embed/live_stream` +
    `?channel=${feed.channelId}` +
    `&autoplay=1` +
    `&mute=${muted ? 1 : 0}` +
    `&controls=0` +
    `&modestbranding=1` +
    `&rel=0` +
    `&iv_load_policy=3` +
    `&disablekb=1` +
    `&fs=0`;

  // When toggling mute we need to reload the iframe with new mute param
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMuted((m) => !m);
    setLoaded(false);
  };

  const handleFocus = () => {
    onFocus?.();
  };

  return (
    <CornerMarkers color={isFocused ? feed.accentColor : "var(--border-default)"}>
      <div
        className="relative flex flex-col overflow-hidden transition-all duration-300"
        style={{
          border: `1px solid ${isFocused ? feed.accentColor : "var(--border-default)"}`,
          backgroundColor: "var(--bg-panel)",
          boxShadow: isFocused ? `0 0 16px ${feed.accentColor}33` : "none",
          cursor: isFocused ? "default" : "pointer",
        }}
        onClick={!isFocused ? handleFocus : undefined}
      >
        {/* Header bar */}
        <div
          className="flex items-center justify-between px-2 py-1.5"
          style={{
            borderBottom: `1px solid var(--border-subtle)`,
            backgroundColor: "var(--bg-elevated)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="blink inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: feed.accentColor }}
            />
            <DataLabel className="!text-[var(--text-secondary)]">{feed.label}</DataLabel>
          </div>
          <div className="flex items-center gap-2">
            <DataLabel>{feed.sublabel}</DataLabel>
            {isFocused && <Timestamp />}
          </div>
        </div>

        {/* Video area */}
        <div
          className="relative"
          style={{ aspectRatio: "16/9", backgroundColor: "#000" }}
        >
          {/* Loading overlay */}
          {!loaded && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <Radio
                size={20}
                className="blink"
                style={{ color: feed.accentColor }}
              />
              <DataLabel>ACQUIRING SIGNAL</DataLabel>
            </div>
          )}

          <iframe
            ref={iframeRef}
            key={`${feed.id}-${muted}`}
            src={embedUrl}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen={false}
            onLoad={() => setLoaded(true)}
            title={feed.label}
            style={{ border: "none", display: "block" }}
          />

          {/* Scanline overlay */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)",
            }}
          />

          {/* CRT vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)",
            }}
          />
        </div>

        {/* Footer controls — only shown when focused */}
        {isFocused && (
          <div
            className="flex items-center justify-between px-2 py-1.5"
            style={{
              borderTop: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-elevated)",
            }}
          >
            <div className="flex items-center gap-1.5">
              <span
                className="blink inline-block h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--signal-red)" }}
              />
              <DataLabel className="!text-[var(--signal-red)]">LIVE</DataLabel>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMuteToggle}
                className="flex items-center gap-1.5 border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.1em] transition-all duration-150"
                style={{
                  borderColor: muted ? "var(--border-default)" : feed.accentColor,
                  color: muted ? "var(--text-muted)" : feed.accentColor,
                }}
              >
                {muted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                {muted ? "MUTED" : "LIVE AUDIO"}
              </button>
            </div>
          </div>
        )}

        {/* Hover overlay for unfocused state */}
        {!isFocused && (
          <div
            className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 hover:opacity-100"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
          >
            <div className="flex items-center gap-2">
              <Maximize2 size={14} style={{ color: feed.accentColor }} />
              <DataLabel className={`!text-[${feed.accentColor}]`}>FOCUS</DataLabel>
            </div>
          </div>
        )}
      </div>
    </CornerMarkers>
  );
}
