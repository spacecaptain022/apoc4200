import { ReactNode } from "react";

type DataLabelProps = {
  children: ReactNode;
  className?: string;
};

export function DataLabel({ children, className = "" }: DataLabelProps) {
  return (
    <span
      className={`font-data text-[10px] uppercase tracking-[0.1em] text-[var(--text-muted)] ${className}`}
    >
      {children}
    </span>
  );
}
