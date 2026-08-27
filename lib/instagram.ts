const RESERVED = new Set([
  "p",
  "reel",
  "reels",
  "stories",
  "explore",
  "accounts",
  "direct",
  "about",
  "legal",
]);

/** Acepta @usuario, usuario o un link de Instagram. Guarda el handle en minúsculas. */
export function parseInstagram(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  let value = raw.replace(/^@/, "");
  value = value.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
  if (value.toLowerCase().startsWith("instagram.com/")) {
    value = value.slice("instagram.com/".length);
  }
  const handle = value.split(/[/?#]/)[0]?.replace(/\/+$/, "").toLowerCase() ?? "";
  if (!handle || RESERVED.has(handle)) return null;
  if (!/^[a-z0-9._]{1,30}$/.test(handle)) return null;
  if (handle.startsWith(".") || handle.endsWith(".") || handle.includes("..")) return null;
  return handle;
}

export function instagramLink(handle: string) {
  return `https://www.instagram.com/${handle}/`;
}

export function formatInstagram(handle: string) {
  return `@${handle}`;
}
