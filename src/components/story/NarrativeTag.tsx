type NarrativeTagProps = {
  label: string;
  urgency?: "breaking" | "developing" | "analysis" | "default";
};

const urgencyMap: Record<string, { color: string; bg: string; border: string }> = {
  breaking:   { color: "var(--signal-red)",   bg: "rgba(255,43,43,0.08)",    border: "var(--signal-red)" },
  developing: { color: "var(--signal-amber)", bg: "rgba(255,176,0,0.08)",    border: "var(--signal-amber)" },
  analysis:   { color: "var(--signal-cyan)",  bg: "rgba(0,229,255,0.06)",    border: "var(--signal-cyan)" },
  default:    { color: "var(--text-muted)",   bg: "transparent",             border: "var(--border-default)" },
};

export function NarrativeTag({ label, urgency = "default" }: NarrativeTagProps) {
  const s = urgencyMap[urgency];
  return (
    <span
      className="inline-flex items-center border px-2 py-0.5 font-data text-[9px] uppercase tracking-[0.12em]"
      style={{
        color: s.color,
        backgroundColor: s.bg,
        borderColor: s.border,
        borderRadius: "var(--radius-sm)",
      }}
    >
      {label}
    </span>
  );
}
