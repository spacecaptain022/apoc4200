"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Zap, Send, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/news",    label: "NEWS" },
  { href: "/markets", label: "MARKETS" },
  { href: "/leaks",   label: "LEAKS" },
  { href: "/signal",  label: "SIGNAL" },
  { href: "/alerts",  label: "ALERTS" },
  { href: "/submit",  label: "SUBMIT" },
];

export function MainMasthead() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        className="relative z-50 w-full border-b"
        style={{
          borderColor: "var(--border-default)",
          backgroundColor: "var(--bg-elevated)",
        }}
      >
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center border"
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
              News<span style={{ color: "var(--signal-green)" }}>Coin</span>
            </span>
          </Link>

          {/* Desktop nav */}
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

          {/* Right utilities */}
          <div className="flex items-center gap-2">
            <button
              className="hidden p-1.5 sm:block"
              style={{ color: "var(--text-muted)" }}
              aria-label="Search"
            >
              <Search size={15} />
            </button>

            <Link
              href="/submit"
              className="hidden items-center gap-1.5 border px-3 py-1.5 font-data text-[10px] tracking-[0.1em] transition-colors duration-150 sm:flex"
              style={{ borderColor: "var(--border-default)", color: "var(--text-secondary)" }}
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
              <span
                className="blink inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--signal-red)" }}
              />
              <span className="hidden xs:inline sm:inline">JOIN ALERTS</span>
              <span className="xs:hidden sm:hidden">ALERTS</span>
            </Link>

            {/* Mobile menu toggle */}
            <button
              className="ml-1 p-1.5 md:hidden"
              style={{ color: menuOpen ? "var(--signal-green)" : "var(--text-muted)" }}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div
            className="absolute left-0 top-full z-50 w-full border-b md:hidden"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-default)",
            }}
          >
            <nav className="mx-auto max-w-[1440px] flex flex-col divide-y px-4"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center py-3.5 font-data text-[12px] uppercase tracking-[0.12em] transition-colors duration-150"
                  style={{ color: "var(--text-secondary)", borderColor: "var(--border-subtle)" }}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/submit"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 py-3.5 font-data text-[12px] uppercase tracking-[0.12em]"
                style={{ color: "var(--text-muted)" }}
              >
                <Send size={12} />
                SUBMIT LEAK
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
