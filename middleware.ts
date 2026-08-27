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

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/moderacion/:path*",
    "/prestadores/nuevo",
    "/recomendar/:path*",
    "/favoritos",
    "/cuenta/:path*",
  ],
};
