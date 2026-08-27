import type { NextAuthConfig } from "next-auth";

type AppRole = "neighbor" | "provider" | "moderator";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.displayName = user.displayName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? "");
        session.user.role = (token.role as AppRole) ?? "neighbor";
        session.user.displayName = String(token.displayName ?? "");
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
