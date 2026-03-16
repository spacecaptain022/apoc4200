"use client";

import { motion } from "motion/react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";

export function ManifestoBlock() {
  return (
    <section
      className="relative w-full overflow-hidden py-16"
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
              TRANSMISSION SOURCE
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
              THE SIGNAL IS NEVER{" "}
              <span style={{ color: "var(--signal-green)" }}>NEUTRAL</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="grid gap-4 md:grid-cols-3"
            >
              {[
                "Markets are narrative warfare. Every price move has a story. Every story has a sponsor.",
                "We don't repeat the feed. We intercept it. We decode the structure underneath the noise.",
                "Anti-mainstream positioning isn't a vibe — it's a methodology. Question the consensus. Follow the flow.",
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
