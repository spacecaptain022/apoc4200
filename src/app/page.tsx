import { BroadcastShell } from "@/components/layout/BroadcastShell";
import { HeroTransmission } from "@/components/hero/HeroTransmission";
import { TickerStack } from "@/components/ticker/TickerStack";
import { TickerBand } from "@/components/ticker/TickerBand";
import { ManifestoBlock } from "@/components/story/ManifestoBlock";
import { TransmissionBreak } from "@/components/media/TransmissionBreak";
import { LiveFeedGrid } from "@/components/media/LiveFeedGrid";
import { AlertSignupForm } from "@/components/forms/AlertSignupForm";

const DEGEN_PHRASES = [
  "TRUST NO ANALYST",
  "EVERY CANDLE IS A CONFESSION",
  "BUY THE SIGNAL NOT THE NEWS",
  "DEGENS DON'T SLEEP",
  "FOLLOW THE FLOW NOT THE NARRATIVE",
  "EVERY ANALYST IS CAPTURED",
  "THE CONSENSUS IS WHERE ALPHA DIES",
  "NO POSITION IS A POSITION",
  "THE CLOSE IS IRRELEVANT",
  "NEVER TRADE THE NEWS",
  "PRICE IS THE ONLY TRUTH",
  "THE CHART NEVER LIES",
  "EARLY OR WRONG — NO IN BETWEEN",
  "THE MARKET DOESN'T CARE ABOUT YOUR THESIS",
  "RISK IS JUST INFORMATION YOU DON'T HAVE YET",
];

export default async function HomePage() {
  return (
    <BroadcastShell>
      {/* 1. Hero */}
      <HeroTransmission />

      {/* Degen doctrine tape */}
      <TickerBand label="DOCTRINE" labelColor="var(--signal-red)" speed={55} direction="left" borderTop borderBottom>
        {DEGEN_PHRASES.map((phrase, i) => (
          <span key={i} className="flex items-center">
            <span className="mx-5 font-data text-[10px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
              {phrase}
            </span>
            <span className="opacity-20" style={{ color: "var(--signal-red)" }}>◆</span>
          </span>
        ))}
      </TickerBand>

      {/* 2. Ticker stack */}
      <TickerStack />

      <TransmissionBreak message="— EYES ON THE TAPE —" color="cyan" />

      {/* 4. Live feeds */}
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <LiveFeedGrid />
      </div>

      <TransmissionBreak message="— SITUATION ROOM — EYES ONLY —" color="amber" />

      {/* 5. Manifesto */}
      <ManifestoBlock />

      <TransmissionBreak message="— BECOME AN OPERATIVE —" color="red" />

      {/* 5. Conversion */}
      <div
        className="w-full py-12"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <AlertSignupForm />

            {/* Tip line CTA */}
            <div
              className="flex flex-col justify-center gap-4 border p-5"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-panel)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                className="font-broadcast text-lg tracking-[0.1em]"
                style={{ color: "var(--text-primary)" }}
              >
                DROP A LEAK
              </span>
              <p
                className="font-data text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Got something the market needs to know? An insider tip, an on-chain anomaly, a leak that&apos;ll move markets?
                <span style={{ color: "var(--text-muted)" }}> Anonymous. Zero traces. We investigate everything.</span>
              </p>
              <a
                href="/submit"
                className="inline-flex w-fit items-center gap-2 border px-4 py-2 font-data text-[11px] uppercase tracking-[0.12em] transition-all duration-150"
                style={{
                  borderColor: "var(--signal-amber)",
                  color: "var(--signal-amber)",
                  backgroundColor: "rgba(255,176,0,0.06)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                BECOME A SOURCE →
              </a>
            </div>
          </div>
        </div>
      </div>
    </BroadcastShell>
  );
}
