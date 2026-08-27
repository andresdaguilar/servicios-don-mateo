"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/actions/auth";
import type { ActionState } from "@/app/actions/auth";

export async function createRequestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const body = String(formData.get("body") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "") || null;
  const urgent = formData.get("urgent") === "on";

  if (body.length < 8) {
    return { error: "Contá qué estás buscando, en una frase." };
  }

  const request = await prisma.request.create({
    data: {
      body,
      urgent,
      categoryId,
      userId: user.id,
    },
  });

  revalidatePath("/solicitudes");
  redirect(`/solicitudes/${request.id}`);
}

export async function replyRequestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const requestId = String(formData.get("requestId") ?? "");
  const body = String(formData.get("body") ?? "").trim();
  const providerId = String(formData.get("providerId") ?? "") || null;

  if (!requestId || body.length < 4) {
    return { error: "Escribí una respuesta." };
  }

  await prisma.requestReply.create({
    data: {
      body,
      requestId,
      userId: user.id,
      providerId,
    },
  });

  revalidatePath(`/solicitudes/${requestId}`);
  revalidatePath("/solicitudes");
  return { ok: true };
}

export async function closeRequestAction(requestId: string) {
  const user = await requireUser();
  const request = await prisma.request.findUnique({ where: { id: requestId } });
  if (!request) return;
  if (request.userId !== user.id && user.role !== "moderator") return;

  await prisma.request.update({
    where: { id: requestId },
    data: { status: "closed" },
  });
  revalidatePath(`/solicitudes/${requestId}`);
  revalidatePath("/solicitudes");
}
