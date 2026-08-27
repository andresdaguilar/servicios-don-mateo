import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/db";
import { parseUserPhone } from "@/lib/phone";
import type { AppRole } from "@/types/next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        phone: { type: "tel" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        const phone = parseUserPhone(String(credentials?.phone ?? ""));
        const password = String(credentials?.password ?? "");
        if (!phone || !password) return null;

        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) return null;

        const ok = await compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          displayName: user.displayName,
          role: user.role as AppRole,
        };
      },
    }),
  ],
});
