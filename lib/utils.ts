import { TRUST_TAG_LABELS } from "@/lib/constants";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function toDisplayName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Vecino";
  if (parts.length === 1) return parts[0];
  const last = parts[parts.length - 1];
  return `${parts[0]} ${last[0]!.toUpperCase()}.`;
}

export function formatRating(value: number) {
  return value.toFixed(1).replace(".", ",");
}

export function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "ahora";
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `hace ${days} d`;
  return d.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short",
  });
}

export function tagLabel(tag: string) {
  return TRUST_TAG_LABELS[tag] ?? tag;
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export type TrustStats = {
  avg: number;
  count: number;
  hired: number;
  wouldCallAgain: number;
  tagCounts: Record<string, number>;
  topTag?: { id: string; count: number };
};

export function aggregateTrust(
  recommendations: Array<{
    rating: number;
    hired: boolean;
    wouldCallAgain: boolean;
    tags: Array<{ tag: string }>;
  }>,
): TrustStats {
  if (recommendations.length === 0) {
    return { avg: 0, count: 0, hired: 0, wouldCallAgain: 0, tagCounts: {} };
  }

  const tagCounts: Record<string, number> = {};
  let hired = 0;
  let wouldCallAgain = 0;
  let ratingSum = 0;

  for (const rec of recommendations) {
    ratingSum += rec.rating;
    if (rec.hired) hired += 1;
    if (rec.wouldCallAgain) wouldCallAgain += 1;
    for (const t of rec.tags) {
      tagCounts[t.tag] = (tagCounts[t.tag] ?? 0) + 1;
    }
  }

  const top = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];

  return {
    avg: ratingSum / recommendations.length,
    count: recommendations.length,
    hired,
    wouldCallAgain,
    tagCounts,
    topTag: top ? { id: top[0], count: top[1] } : undefined,
  };
}
