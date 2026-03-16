type StatusChipProps = {
  label: string;
  variant?: "live" | "alert" | "stale" | "danger" | "sync" | "default";
};

const variantStyles: Record<string, string> = {
  live:    "border-[var(--signal-green)] text-[var(--signal-green)]",
  alert:   "border-[var(--signal-amber)] text-[var(--signal-amber)]",
  stale:   "border-[var(--text-muted)] text-[var(--text-muted)]",
  danger:  "border-[var(--signal-red)] text-[var(--signal-red)]",
  sync:    "border-[var(--signal-cyan)] text-[var(--signal-cyan)]",
  default: "border-[var(--border-default)] text-[var(--text-secondary)]",
};

export function StatusChip({ label, variant = "default" }: StatusChipProps) {
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] font-data tracking-[0.1em] uppercase ${variantStyles[variant]}`}
      style={{ borderRadius: "var(--radius-sm)" }}
    >
      {label}
    </span>
  );
}
