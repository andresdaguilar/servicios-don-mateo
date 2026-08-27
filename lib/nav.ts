export function backHrefFor(pathname: string): string | undefined {
  if (pathname === "/") return undefined;
  if (pathname === "/registro") return "/login";

  const nested = pathname.match(
    /^\/prestadores\/([^/]+)\/(comentar|reportar|recomendar|editar)$/,
  );
  if (nested) return `/prestadores/${nested[1]}`;

  if (pathname.startsWith("/prestadores/nuevo")) return "/";
  if (/^\/prestadores\/[^/]+$/.test(pathname)) return "/buscar";

  return "/";
}
