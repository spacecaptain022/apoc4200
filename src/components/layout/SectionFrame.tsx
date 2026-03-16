import { ReactNode } from "react";

type SectionFrameProps = {
  children: ReactNode;
  label?: string;
  className?: string;
  noPadding?: boolean;
};

export function SectionFrame({ children, label, className = "", noPadding = false }: SectionFrameProps) {
  return (
    <section className={`relative w-full ${className}`}>
      {label && (
        <div
          className="mb-3 flex items-center gap-3"
        >
          <span
            className="font-data text-[10px] uppercase tracking-[0.14em]"
            style={{ color: "var(--text-muted)" }}
          >
            {label}
          </span>
          <span
            className="h-px flex-1"
            style={{ backgroundColor: "var(--border-subtle)" }}
          />
        </div>
      )}
      <div className={noPadding ? "" : ""}>{children}</div>
    </section>
  );
}
