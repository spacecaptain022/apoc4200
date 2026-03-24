import Link from "next/link";
import { Zap } from "lucide-react";

const LINKS = [
  { href: "/news",    label: "NEWS" },
  { href: "/markets", label: "MARKETS" },
  { href: "/signal",  label: "SIGNAL" },
  { href: "/alerts",  label: "ALERTS" },
  { href: "/submit",  label: "SUBMIT" },
  { href: "/about",   label: "ABOUT" },
  { href: "/archive", label: "ARCHIVE" },
];

export function TerminalFooter() {
  return (
    <footer
      className="w-full border-t"
      style={{
        borderColor: "var(--border-subtle)",
        backgroundColor: "var(--bg-elevated)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-4 py-8">
        {/* Top row */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="flex h-6 w-6 items-center justify-center border"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-panel)",
              }}
            >
              <Zap size={11} style={{ color: "var(--signal-green)" }} />
            </div>
            <span
              className="font-broadcast text-base tracking-[0.14em]"
              style={{ color: "var(--text-secondary)" }}
            >
              News<span style={{ color: "var(--signal-green)" }}>Coin</span>
            </span>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-data text-[10px] tracking-[0.1em] transition-colors duration-150"
                style={{ color: "var(--text-muted)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div
          className="my-6 h-px w-full"
          style={{ backgroundColor: "var(--border-subtle)" }}
        />

        {/* Bottom row */}
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <span
            className="font-data text-[10px] tracking-[0.14em] uppercase"
            style={{ color: "var(--text-muted)" }}
          >
            END OF TRANSMISSION
          </span>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="font-data text-[10px] tracking-[0.08em]"
              style={{ color: "var(--text-muted)" }}
            >
              PRIVACY
            </Link>
            <Link
              href="/terms"
              className="font-data text-[10px] tracking-[0.08em]"
              style={{ color: "var(--text-muted)" }}
            >
              TERMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
