// In-memory leaks store — shared across API routes in the same Node.js process.
// Leaks are kept in reverse-chronological order, capped at 200 entries.

export type LeakEntry = {
  id:          string;
  refId:       string;  // e.g. "LEAK-0042"
  category:    "CRYPTO" | "MARKETS" | "GEOPOLITICS" | "MACRO" | "OTHER";
  sourceType:  "INSIDER" | "WHISTLEBLOWER" | "MARKET_OBSERVATION" | "TECHNICAL" | "ANONYMOUS";
  urgency:     "BREAKING" | "DEVELOPING" | "ANALYSIS";
  preview:     string;  // first 300 chars of message — no full text public
  hasEvidence: boolean;
  receivedAt:  number;  // ms timestamp
};

const MAX_LEAKS = 200;

// Module-level singleton
let store: LeakEntry[] = [];
let counter = 0;

export function addLeak(entry: Omit<LeakEntry, "id" | "refId" | "receivedAt">): LeakEntry {
  counter += 1;
  const leak: LeakEntry = {
    ...entry,
    id:         `leak-${Date.now()}-${counter}`,
    refId:      `LEAK-${String(counter).padStart(4, "0")}`,
    receivedAt: Date.now(),
  };
  store = [leak, ...store].slice(0, MAX_LEAKS);
  return leak;
}

export function getLeaks(): LeakEntry[] {
  return store;
}
