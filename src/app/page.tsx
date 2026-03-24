import { BroadcastShell } from "@/components/layout/BroadcastShell";
import { HeroTransmission } from "@/components/hero/HeroTransmission";
import { TickerStack } from "@/components/ticker/TickerStack";
import { StoryRail, MOCK_STORIES } from "@/components/story/StoryRail";
import { ManifestoBlock } from "@/components/story/ManifestoBlock";
import { TransmissionBreak } from "@/components/media/TransmissionBreak";
import { LiveFeedGrid } from "@/components/media/LiveFeedGrid";
import { AlertSignupForm } from "@/components/forms/AlertSignupForm";
import type { StoryCardData } from "@/components/story/StoryCard";
import type { NewsArticle } from "@/app/api/news/route";

async function getLiveStories(): Promise<StoryCardData[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/news`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return MOCK_STORIES;
    const data = await res.json();
    const articles: NewsArticle[] = data.articles ?? [];
    return articles.slice(0, 8).map((a) => ({
      title: a.title,
      dek: a.description?.slice(0, 180) || undefined,
      slug: a.id,
      url: a.url,
      source: a.source,
      category: a.category,
      urgency: a.urgency,
      publishedAt: a.publishedAt,
      mediaUrl: a.mediaUrl,
    }));
  } catch {
    return MOCK_STORIES;
  }
}

export default async function HomePage() {
  const stories = await getLiveStories();

  return (
    <BroadcastShell>
      {/* 1. Hero */}
      <HeroTransmission />

      {/* 2. Ticker stack */}
      <TickerStack />

      {/* 3. Lead stories */}
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <StoryRail stories={stories} />
      </div>

      <TransmissionBreak message="— INTERCEPTED TRANSMISSIONS —" color="cyan" />

      {/* 4. Live feeds */}
      <div className="mx-auto max-w-[1440px] px-4 py-12">
        <LiveFeedGrid />
      </div>

      <TransmissionBreak message="— SITUATION ROOM —" color="amber" />

      {/* 5. Manifesto */}
      <ManifestoBlock />

      <TransmissionBreak message="— JOIN THE NETWORK —" color="red" />

      {/* 5. Conversion */}
      <div
        className="w-full py-12"
        style={{ borderBottom: "1px solid var(--border-subtle)" }}
      >
        <div className="mx-auto max-w-[1440px] px-4">
          <div className="grid gap-6 md:grid-cols-2">
            <AlertSignupForm />

            {/* Tip line CTA */}
            <div
              className="flex flex-col justify-center gap-4 border p-5"
              style={{
                borderColor: "var(--border-default)",
                backgroundColor: "var(--bg-panel)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span
                className="font-broadcast text-lg tracking-[0.1em]"
                style={{ color: "var(--text-primary)" }}
              >
                SUBMIT A LEAK
              </span>
              <p
                className="font-data text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                Got a tip, source, or intercepted transmission? Drop it here — anonymous, secure.
              </p>
              <a
                href="/submit"
                className="inline-flex w-fit items-center gap-2 border px-4 py-2 font-data text-[11px] uppercase tracking-[0.12em] transition-all duration-150"
                style={{
                  borderColor: "var(--signal-amber)",
                  color: "var(--signal-amber)",
                  backgroundColor: "rgba(255,176,0,0.06)",
                  borderRadius: "var(--radius-sm)",
                }}
              >
                BECOME A SOURCE →
              </a>
            </div>
          </div>
        </div>
      </div>
    </BroadcastShell>
  );
}
