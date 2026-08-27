const BLOCKED_HOSTS = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1"]);

/** Acepta donmateo.com.ar o https://donmateo.com.ar. Guarda un http(s) absoluto. */
export function parseWebsite(input: string): string | null {
  const raw = input.trim();
  if (!raw || raw.length > 200) return null;
  if (/\s/.test(raw)) return null;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;

  let parsed: URL;
  try {
    parsed = new URL(withProtocol);
  } catch {
    return null;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;

  const host = parsed.hostname.toLowerCase();
  if (!host || BLOCKED_HOSTS.has(host) || !host.includes(".")) return null;
  if (host.startsWith(".") || host.endsWith(".") || host.includes("..")) return null;

  parsed.hostname = host;
  parsed.hash = "";
  parsed.username = "";
  parsed.password = "";

  let href = parsed.href;
  if (parsed.pathname === "/" && !parsed.search) {
    href = href.replace(/\/$/, "");
  }
  if (href.length > 200) return null;
  return href;
}

export function formatWebsite(url: string) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
    return `${host}${path}${parsed.search}`;
  } catch {
    return url;
  }
}
