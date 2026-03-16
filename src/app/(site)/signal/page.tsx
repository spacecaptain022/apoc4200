import { BroadcastShell } from "@/components/layout/BroadcastShell";
import { LiveFeedGrid } from "@/components/media/LiveFeedGrid";
import { TickerStack } from "@/components/ticker/TickerStack";

export default function SignalPage() {
  return (
    <BroadcastShell>
      <TickerStack />

      <div
        className="w-full border-b py-6"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="flex items-end justify-between">
            <div>
              <h1
                className="font-broadcast text-5xl leading-none tracking-[0.08em]"
                style={{ color: "var(--text-primary)" }}
              >
                SIGNAL <span style={{ color: "var(--signal-cyan)" }}>ROOM</span>
              </h1>
              <p
                className="mt-2 font-data text-xs"
                style={{ color: "var(--text-muted)" }}
              >
                Live transmissions intercepted from multiple broadcast networks.
              </p>
            </div>
            <span
              className="hidden font-data text-[10px] uppercase tracking-[0.14em] sm:block"
              style={{ color: "var(--text-muted)" }}
            >
              ALL FEEDS MUTED BY DEFAULT — CLICK TO FOCUS
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-10">
        <LiveFeedGrid />
      </div>
    </BroadcastShell>
  );
}
