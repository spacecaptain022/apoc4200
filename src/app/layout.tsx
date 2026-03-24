import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "News Coin — Signal Acquired",
  description:
    "Real-time narratives, market war zones, and live degen telemetry. The news is theater. The signal is here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
