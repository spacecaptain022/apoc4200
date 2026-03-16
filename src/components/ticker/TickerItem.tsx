type TickerItemProps = {
  label: string;
  value?: string;
  change?: number;
  separator?: boolean;
};

export function TickerItem({ label, value, change, separator = false }: TickerItemProps) {
  const changeColor =
    change === undefined
      ? "var(--text-secondary)"
      : change > 0
      ? "var(--signal-green)"
      : change < 0
      ? "var(--signal-red)"
      : "var(--text-muted)";

  const changeSign = change !== undefined && change > 0 ? "+" : "";

  return (
    <span className="inline-flex items-center gap-1.5 px-4 font-data text-[11px] whitespace-nowrap">
      <span style={{ color: "var(--text-muted)" }} className="tracking-[0.08em] uppercase">
        {label}
      </span>
      {value && (
        <span style={{ color: "var(--text-primary)" }} className="tabular-nums">
          {value}
        </span>
      )}
      {change !== undefined && (
        <span style={{ color: changeColor }} className="tabular-nums">
          {changeSign}{change.toFixed(2)}%
        </span>
      )}
      {separator && (
        <span style={{ color: "var(--border-strong)" }} className="ml-2">
          ·
        </span>
      )}
    </span>
  );
}
