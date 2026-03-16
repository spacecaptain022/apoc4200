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
      {/* Ambient noise grain */}
      <div
        className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />

      <TopStatusBar />
      <MainMasthead />

      <main className="flex-1">{children}</main>

      <TerminalFooter />
    </div>
  );
}
