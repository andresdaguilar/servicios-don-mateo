"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { toDisplayName } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre").max(80),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  communityCode: z.string().min(1, "Ingresá el código del barrio"),
});

export type ActionState = { error?: string; ok?: boolean } | null;

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    communityCode: formData.get("communityCode"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const expected = process.env.COMMUNITY_ACCESS_CODE ?? "DONMATEO";
  if (parsed.data.communityCode.trim().toUpperCase() !== expected.toUpperCase()) {
    return { error: "El código de comunidad no es válido." };
  }

  const email = parsed.data.email.trim().toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return { error: "Ya hay una cuenta con ese email." };

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      displayName: toDisplayName(parsed.data.name),
      email,
      passwordHash,
      communityVerifiedAt: new Date(),
      role: adminEmail && email === adminEmail ? "moderator" : "neighbor",
    },
  });

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Cuenta creada. Iniciá sesión." };
    }
    throw error;
  }

  return { ok: true };
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/") || "/";

  if (!email || !password) return { error: "Completá email y contraseña." };

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: from.startsWith("/") ? from : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Email o contraseña incorrectos." };
    }
    throw error;
  }
  return { ok: true };
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHENTICATED");
  }
  return session.user;
}

export async function requireModerator() {
  const user = await requireUser();
  if (user.role !== "moderator") {
    throw new Error("FORBIDDEN");
  }
  return user;
}
