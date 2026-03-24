"use client";

import { motion } from "motion/react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";

export function ManifestoBlock() {
  return (
    <section
      className="relative w-full overflow-hidden py-10 lg:py-16"
      style={{ borderTop: "1px solid var(--border-subtle)" }}
    >
      {/* Background accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(ellipse at 20% 50%, var(--signal-green) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-[1440px] px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Left — label column */}
          <div className="flex flex-col justify-start gap-4 md:col-span-3">
            <span
              className="font-data text-[10px] uppercase tracking-[0.14em]"
              style={{ color: "var(--text-muted)" }}
            >
              DEGEN MANIFESTO
            </span>
            <div
              className="h-px w-12"
              style={{ backgroundColor: "var(--signal-green)" }}
            />
          </div>

          {/* Right — manifesto text */}
          <div className="flex flex-col gap-6 md:col-span-9">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="font-broadcast leading-tight tracking-[0.06em]"
              style={{
                fontSize: "clamp(28px, 4vw, 52px)",
                color: "var(--text-primary)",
              }}
            >
              THE FEED IS{" "}
              <span className="glitch-slow" style={{ color: "var(--signal-red)" }}>COMPROMISED.</span>
              <br />
              <span style={{ color: "var(--signal-green)" }}>WE ARE NOT.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                "Every candle is a confession. Every wick is a tell. We read price action — not press releases.",
                "No editorial board. No sponsor calls. Built in the dark with raw data and a terminal that never closes.",
                "The consensus is where alpha goes to die. We operate in the gap between what's happening and what they're allowed to say.",
              ].map((text, i) => (
                <CornerMarkers key={i} color="var(--border-default)">
                  <div
                    className="p-4"
                    style={{
                      border: "1px solid var(--border-subtle)",
                      backgroundColor: "var(--bg-panel)",
                    }}
                  >
                    <p
                      className="font-data text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {text}
                    </p>
                  </div>
                </CornerMarkers>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
