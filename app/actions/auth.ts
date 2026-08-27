"use server";

import { hash } from "bcryptjs";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { isValidInviteCode } from "@/lib/invite";
import { parseUserPhone } from "@/lib/phone";
import { toDisplayName } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Ingresá tu nombre").max(80),
  phone: z.string().min(8, "Ingresá tu celular"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  communityCode: z.string().min(1, "Ingresá el código de invitación"),
});

export type ActionState = {
  error?: string;
  ok?: boolean;
  href?: string;
  hrefLabel?: string;
} | null;

export async function registerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    communityCode: formData.get("communityCode"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  if (!isValidInviteCode(parsed.data.communityCode)) {
    return { error: "El código o el link de invitación no es válido." };
  }

  const phone = parseUserPhone(parsed.data.phone);
  if (!phone) {
    return { error: "Usá un celular argentino, con prefijo +549." };
  }

  const exists = await prisma.user.findUnique({ where: { phone } });
  if (exists) return { error: "Ya hay una cuenta con ese teléfono." };

  const adminPhone = parseUserPhone(process.env.ADMIN_PHONE ?? "");
  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name.trim(),
      displayName: toDisplayName(parsed.data.name),
      phone,
      passwordHash,
      communityVerifiedAt: new Date(),
      role: adminPhone && phone === adminPhone ? "moderator" : "neighbor",
    },
  });

  try {
    await signIn("credentials", {
      phone,
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
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const from = String(formData.get("from") ?? "/") || "/";

  if (!phone || !password) return { error: "Completá teléfono y contraseña." };
  if (!parseUserPhone(phone)) {
    return { error: "Usá un celular argentino, con prefijo +549." };
  }

  try {
    await signIn("credentials", {
      phone,
      password,
      redirectTo: from.startsWith("/") ? from : "/",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Teléfono o contraseña incorrectos." };
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
