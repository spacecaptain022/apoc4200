"use client";

import { useEffect, useRef, ReactNode } from "react";
import Lenis from "lenis";
import { TopStatusBar } from "./TopStatusBar";
import { MainMasthead } from "./MainMasthead";
import { TerminalFooter } from "./TerminalFooter";

type BroadcastShellProps = {
  children: ReactNode;
};

export function BroadcastShell({ children }: BroadcastShellProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    lenisRef.current = lenis;

    let raf: number;
    const animate = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      className="scanlines relative flex min-h-dvh flex-col"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Animated noise grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.045]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "180px 180px",
          animation: "noise-shift 0.4s steps(1) infinite",
        }}
      />

      {/* Moving scan line */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9997] h-[3px]"
        style={{
          top: 0,
          background: "linear-gradient(to right, transparent, var(--signal-cyan) 30%, var(--signal-green) 70%, transparent)",
          opacity: 0.07,
          animation: "scan-line 14s linear infinite",
        }}
      />

      {/* Horizontal glitch band */}
      <div
        className="pointer-events-none fixed left-0 right-0 z-[9996]"
        style={{
          top: 0,
          height: "6px",
          background: `repeating-linear-gradient(90deg, transparent, transparent 4px, var(--signal-cyan) 4px, var(--signal-cyan) 5px)`,
          animation: "glitch-band 7s step-end infinite",
        }}
      />

      {/* Corner vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-[9995]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      <TopStatusBar />
      <MainMasthead />

      <main className="flex-1">{children}</main>

      <TerminalFooter />
    </div>
  );
}
