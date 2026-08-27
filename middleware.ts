import { NextResponse } from "next/server";
import { auth } from "@/auth";

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
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  if (WRITE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    if (!isLoggedIn) {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("from", pathname);
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
