import { SignalDot } from "@/components/ui/SignalDot";

type LiveBadgeProps = {
  label?: string;
  color?: "green" | "red" | "amber" | "cyan";
};

const colorMap = {
  green: { text: "var(--signal-green)", border: "var(--signal-green)", bg: "rgba(92,255,92,0.06)" },
  red:   { text: "var(--signal-red)",   border: "var(--signal-red)",   bg: "rgba(255,43,43,0.06)" },
  amber: { text: "var(--signal-amber)", border: "var(--signal-amber)", bg: "rgba(255,176,0,0.06)" },
  cyan:  { text: "var(--signal-cyan)",  border: "var(--signal-cyan)",  bg: "rgba(0,229,255,0.06)" },
};

export function LiveBadge({ label = "LIVE", color = "red" }: LiveBadgeProps) {
  const c = colorMap[color];
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-0.5 font-data text-[10px] tracking-[0.14em] uppercase"
      style={{
        borderColor: c.border,
        color: c.text,
        backgroundColor: c.bg,
        borderRadius: "var(--radius-sm)",
      }}
    >
      <SignalDot color={color} size="sm" pulse />
      {label}
    </span>
  );
}
