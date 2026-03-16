import { ReactNode } from "react";

type CornerMarkersProps = {
  children: ReactNode;
  color?: string;
  className?: string;
};

export function CornerMarkers({
  children,
  color = "var(--signal-green)",
  className = "",
}: CornerMarkersProps) {
  const style = { "--marker-color": color } as React.CSSProperties;

  return (
    <div className={`relative ${className}`} style={style}>
      {/* TL */}
      <span
        className="pointer-events-none absolute left-0 top-0 h-2 w-2"
        style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}` }}
      />
      {/* TR */}
      <span
        className="pointer-events-none absolute right-0 top-0 h-2 w-2"
        style={{ borderTop: `1px solid ${color}`, borderRight: `1px solid ${color}` }}
      />
      {/* BL */}
      <span
        className="pointer-events-none absolute bottom-0 left-0 h-2 w-2"
        style={{ borderBottom: `1px solid ${color}`, borderLeft: `1px solid ${color}` }}
      />
      {/* BR */}
      <span
        className="pointer-events-none absolute bottom-0 right-0 h-2 w-2"
        style={{ borderBottom: `1px solid ${color}`, borderRight: `1px solid ${color}` }}
      />
      {children}
    </div>
  );
}
