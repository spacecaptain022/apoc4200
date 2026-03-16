import { ReactNode } from "react";
import { CornerMarkers } from "@/components/ui/CornerMarkers";
import { DataLabel } from "@/components/ui/DataLabel";

type CRTFrameProps = {
  children: ReactNode;
  label?: string;
  sublabel?: string;
  className?: string;
};

export function CRTFrame({ children, label, sublabel, className = "" }: CRTFrameProps) {
  return (
    <CornerMarkers color="var(--signal-green)" className={className}>
      <div
        style={{
          border: "1px solid var(--border-default)",
          backgroundColor: "var(--bg-panel)",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
        }}
      >
        {(label || sublabel) && (
          <div
            className="flex items-center justify-between px-3 py-1.5"
            style={{
              borderBottom: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-elevated)",
            }}
          >
            {label && <DataLabel>{label}</DataLabel>}
            {sublabel && <DataLabel>{sublabel}</DataLabel>}
          </div>
        )}
        <div className="relative overflow-hidden">
          {children}
          {/* Scanlines on the frame */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(to bottom, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)",
            }}
          />
        </div>
      </div>
    </CornerMarkers>
  );
}
