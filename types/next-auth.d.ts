import { DefaultSession } from "next-auth";

export type AppRole = "neighbor" | "provider" | "moderator";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: AppRole;
      displayName: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: AppRole;
    displayName: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: AppRole;
    displayName: string;
  }
}
