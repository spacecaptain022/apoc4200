"use client";

type TransmissionBreakProps = {
  message?: string;
  color?: "green" | "red" | "amber" | "cyan";
};

const colorMap = {
  green: "var(--signal-green)",
  red:   "var(--signal-red)",
  amber: "var(--signal-amber)",
  cyan:  "var(--signal-cyan)",
};

export function TransmissionBreak({
  message = "— TRANSMISSION CONTINUES —",
  color = "green",
}: TransmissionBreakProps) {
  const c = colorMap[color];
  return (
    <div
      className="relative flex w-full items-center justify-center py-6"
      style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}
    >
      <div
        className="h-px flex-1"
        style={{ backgroundColor: "var(--border-subtle)" }}
      />
      <span
        className="mx-6 font-data text-[10px] uppercase tracking-[0.2em]"
        style={{ color: c }}
      >
        {message}
      </span>
      <div
        className="h-px flex-1"
        style={{ backgroundColor: "var(--border-subtle)" }}
      />
    </div>
  );
}
