import { searchProgrammes } from "./programmes";

export const GUIDED_QUESTIONS = [
  { key: "interest", label: "What interests you most?", options: ["Working with hands", "Design & creativity", "Food & hospitality", "Tech & media"] },
  { key: "method", label: "How do you want to learn?", options: ["Physical", "Online", "Either"] },
  { key: "budget", label: "Budget?", options: ["Free only", "Sponsored", "Can pay"] },
  { key: "state", label: "Where?", options: ["Lagos", "FCT", "Anywhere"] }
] as const;

const INTEREST_TO_TRADES: Record<string, string[]> = {
  "Working with hands": ["Electrical Installation", "Plumbing", "Welding", "Carpentry", "Construction", "Automotive"],
  "Design & creativity": ["Fashion", "Beauty", "Photography", "Videography", "Carpentry"],
  "Food & hospitality": ["Catering"],
  "Tech & media": ["Photography", "Videography"]
};

export async function guidedRecommend(answers: Record<string, string>) {
  const trades = INTEREST_TO_TRADES[answers.interest ?? ""] ?? [];
  const format = answers.method === "Physical" ? "offline" : answers.method === "Online" ? "online" : undefined;
  const costType =
    answers.budget === "Free only" ? "free" : undefined;
  const state = answers.state === "Anywhere" ? undefined : answers.state;
  // Try each trade in order, return first non-empty set (max 3 trades checked)
  for (const trade of trades.slice(0, 3)) {
    const rows = await searchProgrammes({ trade, format: format as never, costType: costType as never, state });
    if (rows.length > 0) return { trade, rows: rows.slice(0, 6) };
  }
  const fallback = await searchProgrammes({ format: format as never, costType: costType as never, state });
  return { trade: "General", rows: fallback.slice(0, 6) };
}
