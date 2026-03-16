"use client";

import Link from "next/link";
import { Search, Zap, Send, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "/news",    label: "NEWS" },
  { href: "/markets", label: "MARKETS" },
  { href: "/signal",  label: "SIGNAL" },
  { href: "/alerts",  label: "ALERTS" },
  { href: "/submit",  label: "SUBMIT" },
];

export function MainMasthead() {
  return (
    <header
      className="w-full border-b"
      style={{
        borderColor: "var(--border-default)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4">
        {/* Logo / wordmark */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className="flex h-8 w-8 items-center justify-center border"
            style={{
              borderColor: "var(--signal-green)",
              backgroundColor: "var(--bg-panel)",
              boxShadow: "var(--glow-green)",
            }}
          >
            <Zap size={14} style={{ color: "var(--signal-green)" }} />
          </div>
          <span
            className="font-broadcast text-xl tracking-[0.14em]"
            style={{ color: "var(--text-primary)" }}
          >
            APOC<span style={{ color: "var(--signal-green)" }}>4200</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-data text-[11px] tracking-[0.1em] transition-colors duration-150"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Utility actions */}
        <div className="flex items-center gap-3">
          <button
            className="hidden p-1.5 transition-colors duration-150 sm:block"
            style={{ color: "var(--text-muted)" }}
            aria-label="Search"
          >
            <Search size={15} />
          </button>
          <Link
            href="/submit"
            className="hidden items-center gap-1.5 border px-3 py-1.5 font-data text-[10px] tracking-[0.1em] transition-colors duration-150 sm:flex"
            style={{
              borderColor: "var(--border-default)",
              color: "var(--text-secondary)",
            }}
          >
            <Send size={11} />
            SUBMIT LEAK
          </Link>
          <Link
            href="/alerts"
            className="flex items-center gap-1.5 border px-3 py-1.5 font-data text-[10px] tracking-[0.1em] transition-colors duration-150"
            style={{
              borderColor: "var(--signal-red)",
              color: "var(--signal-red)",
              backgroundColor: "rgba(255,43,43,0.06)",
            }}
          >
            <SignalDotInline />
            JOIN ALERTS
          </Link>
          <button
            className="ml-1 p-1.5 md:hidden"
            style={{ color: "var(--text-muted)" }}
            aria-label="Menu"
          >
            <Menu size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

function SignalDotInline() {
  return (
    <span
      className="blink inline-block h-1.5 w-1.5 rounded-full"
      style={{ backgroundColor: "var(--signal-red)" }}
    />
  );
}
