export const tokens = {
  colors: {
    bg: "#F8FAF7",
    card: "#FFFFFF",
    ink: "#101828",
    muted: "#667085",
    primary: "#0E7C3E",
    primaryDark: "#0A5E30",
    accent: "#F59E0B",
    info: "#175CD3",
    danger: "#D92D20",
    border: "#E4E7EC"
  },
  radius: { card: 12, input: 8 },
  type: { h1: 24, h2: 20, body: 16, small: 14 }
} as const;

export type BadgeKind = "verified" | "free" | "sponsored" | "paid" | "warn";

export function badgeLabel(kind: BadgeKind): string {
  switch (kind) {
    case "verified": return "✓ Verified";
    case "free": return "Free";
    case "sponsored": return "Sponsored";
    case "paid": return "Paid";
    case "warn": return "Needs review";
  }
}
