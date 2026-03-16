import { StoryCard, type StoryCardData } from "./StoryCard";
import { SectionFrame } from "@/components/layout/SectionFrame";

type StoryRailProps = {
  stories: StoryCardData[];
};

// Mock stories — swap in CMS data in Phase 3
export const MOCK_STORIES: StoryCardData[] = [
  {
    title: "FED HOLDS AS INFLATION RESURGES — MARKETS CRATER",
    dek: "A surprise CPI print sent equities into freefall as the Federal Reserve signaled no rate cuts through Q3. Bond vigilantes are circling.",
    slug: "fed-holds-inflation-resurges",
    category: "MACRO",
    urgency: "breaking",
    publishedAt: "TODAY 09:14",
  },
  {
    title: "BITCOIN BREAKS $85K — WHALES ACCUMULATING",
    slug: "bitcoin-85k-whales",
    category: "CRYPTO",
    urgency: "developing",
    publishedAt: "TODAY 08:50",
  },
  {
    title: "NVIDIA CRUSHES EARNINGS — AI CAPEX CYCLE INTACT",
    slug: "nvidia-earnings-ai",
    category: "MARKETS",
    urgency: "analysis",
    publishedAt: "TODAY 08:22",
  },
  {
    title: "CHINA DUMPS TREASURIES — DOLLAR WEAPONIZATION ESCALATES",
    slug: "china-treasuries-dollar",
    category: "GEOPOLITICS",
    urgency: "developing",
    publishedAt: "YESTERDAY",
  },
  {
    title: "MEME COIN SURGE: DEGEN ROTATION INTO LOW CAPS",
    slug: "meme-coin-surge",
    category: "DEGEN",
    urgency: "default",
    publishedAt: "YESTERDAY",
  },
];

export function StoryRail({ stories }: StoryRailProps) {
  const [lead, ...secondary] = stories;

  return (
    <SectionFrame label="LEAD STORIES">
      <div className="grid gap-3 md:grid-cols-12">
        {/* Lead story — dominant */}
        <div className="md:col-span-7">
          <StoryCard story={lead} variant="lead" />
        </div>

        {/* Secondary grid */}
        <div className="grid gap-3 md:col-span-5 md:grid-rows-2">
          {secondary.slice(0, 2).map((story, i) => (
            <StoryCard key={story.slug} story={story} variant="secondary" delay={0.05 * (i + 1)} />
          ))}
        </div>

        {/* Bottom row */}
        {secondary.slice(2).map((story, i) => (
          <div key={story.slug} className="md:col-span-4">
            <StoryCard story={story} variant="secondary" delay={0.1 * (i + 1)} />
          </div>
        ))}
      </div>
    </SectionFrame>
  );
}
