import { BroadcastShell } from "@/components/layout/BroadcastShell";
import { SubmitLeakForm } from "@/components/forms/SubmitLeakForm";
import { Lock, Shield, Eye, Radio } from "lucide-react";

const PROTECTIONS = [
  {
    icon: Lock,
    label: "ENCRYPTED TRANSIT",
    desc: "All transmissions are encrypted end-to-end. We never log IP addresses.",
  },
  {
    icon: Shield,
    label: "SOURCE PROTECTED",
    desc: "We will never identify or expose a source without explicit consent.",
  },
  {
    icon: Eye,
    label: "NEED-TO-KNOW ONLY",
    desc: "Submissions are reviewed by editors only. Not stored on public servers.",
  },
  {
    icon: Radio,
    label: "ANONYMOUS OK",
    desc: "No contact info required. Tip anonymously — we'll still run the story.",
  },
];

export default function SubmitPage() {
  return (
    <BroadcastShell>
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <div className="grid gap-10 lg:grid-cols-12">

          {/* Left — context */}
          <div className="lg:col-span-4 lg:sticky lg:top-8 lg:self-start">
            {/* Header */}
            <div
              className="mb-8 border-l-2 pl-4"
              style={{ borderColor: "var(--signal-amber)" }}
            >
              <p
                className="mb-1 font-data text-[10px] uppercase tracking-[0.16em]"
                style={{ color: "var(--signal-amber)" }}
              >
                SECURE CHANNEL OPEN
              </p>
              <h1
                className="font-broadcast text-4xl leading-tight tracking-[0.06em]"
                style={{ color: "var(--text-primary)" }}
              >
                SUBMIT
                <br />A LEAK
              </h1>
            </div>

            <p
              className="mb-8 font-data text-sm leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Got something the market needs to know? An insider tip, an anomaly you spotted on-chain, a geopolitical signal that hasn&apos;t hit the wires yet?
              <br /><br />
              We investigate every submission. The best signals become stories.
            </p>

            {/* Protections */}
            <div className="flex flex-col gap-4">
              {PROTECTIONS.map(({ icon: Icon, label, desc }) => (
                <div
                  key={label}
                  className="flex gap-3 border p-3"
                  style={{
                    borderColor:     "var(--border-default)",
                    backgroundColor: "var(--bg-panel)",
                    borderRadius:    "var(--radius-sm)",
                  }}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    <Icon size={13} style={{ color: "var(--signal-green)" }} />
                  </div>
                  <div>
                    <p
                      className="mb-1 font-data text-[10px] uppercase tracking-[0.1em]"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {label}
                    </p>
                    <p
                      className="font-data text-[10px] leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider note */}
            <div
              className="mt-8 border-t pt-6"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <p
                className="font-data text-[10px] leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                By submitting you agree to our editorial discretion. We verify before publishing. False tips waste everyone&apos;s time — don&apos;t.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div
            className="border p-6 lg:col-span-8 sm:p-8"
            style={{
              borderColor:     "var(--border-default)",
              backgroundColor: "var(--bg-panel)",
              borderRadius:    "var(--radius-md)",
            }}
          >
            <div className="mb-7 flex items-center gap-3">
              <span
                className="blink inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: "var(--signal-amber)" }}
              />
              <span
                className="font-data text-[11px] uppercase tracking-[0.14em]"
                style={{ color: "var(--signal-amber)" }}
              >
                SECURE TRANSMISSION FORM
              </span>
            </div>

            <SubmitLeakForm />
          </div>

        </div>
      </div>
    </BroadcastShell>
  );
}
