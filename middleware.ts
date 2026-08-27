import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

const WRITE_PREFIXES = [
  "/prestadores/nuevo",
  "/recomendar",
  "/favoritos",
  "/cuenta",
];

function allowScreenshots(res: NextResponse) {
  // `no-store` hace que Android/Samsung bloqueen capturas ("políticas de privacidad").
  res.headers.set("Cache-Control", "private, no-cache, max-age=0, must-revalidate");
  res.headers.set("Permissions-Policy", "display-capture=*");
  return res;
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = Boolean(req.auth);

  if (pathname.startsWith("/moderacion")) {
    if (!isLoggedIn || req.auth?.user.role !== "moderator") {
      const url = req.nextUrl.clone();
      const from = `${pathname}${req.nextUrl.search}`;
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("from", from);
      return NextResponse.redirect(url);
    }
  }

  if (WRITE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      const from = `${pathname}${req.nextUrl.search}`;
      url.pathname = "/login";
      url.search = "";
      url.searchParams.set("from", from);
      return NextResponse.redirect(url);
    }
  }

  if (/^\/prestadores\/[^/]+\/editar$/.test(pathname) && !isLoggedIn) {
    const url = req.nextUrl.clone();
    const from = `${pathname}${req.nextUrl.search}`;
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("from", from);
    return NextResponse.redirect(url);
  }

  return allowScreenshots(NextResponse.next());
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
