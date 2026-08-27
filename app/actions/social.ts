"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { TRUST_TAGS, REPORT_REASONS } from "@/lib/constants";
import { requireUser } from "@/app/actions/auth";
import type { ActionState } from "@/app/actions/auth";
import { runAction } from "@/lib/errors";

const recSchema = z.object({
  providerId: z.string(),
  comment: z.string().min(8, "Escribí un comentario breve").max(500),
  rating: z.coerce.number().int().min(1).max(5),
  hired: z.boolean(),
  wouldCallAgain: z.boolean(),
  tags: z.array(z.string()),
});

export async function recommendAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const parsed = recSchema.safeParse({
      providerId: formData.get("providerId"),
      comment: formData.get("comment"),
      rating: formData.get("rating"),
      hired: formData.get("hired") === "on" || formData.get("hired") === "true",
      wouldCallAgain:
        formData.get("wouldCallAgain") === "on" ||
        formData.get("wouldCallAgain") === "true",
      tags: formData.getAll("tags").map(String),
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Revisá los datos e intentá de nuevo." };
    }

    const allowed = new Set(TRUST_TAGS.map((t) => t.id));
    const tags = parsed.data.tags.filter((t) => allowed.has(t as never));

    const existing = await prisma.recommendation.findUnique({
      where: {
        userId_providerId: { userId: user.id, providerId: parsed.data.providerId },
      },
    });
    if (existing) return { error: "Ya recomendaste a este prestador." };

    await prisma.recommendation.create({
      data: {
        comment: parsed.data.comment.trim(),
        rating: parsed.data.rating,
        hired: parsed.data.hired,
        wouldCallAgain: parsed.data.wouldCallAgain,
        userId: user.id,
        providerId: parsed.data.providerId,
        tags: { create: tags.map((tag) => ({ tag })) },
      },
    });

    await prisma.provider.update({
      where: { id: parsed.data.providerId },
      data: { lastRecommendedAt: new Date() },
    });

    revalidatePath(`/prestadores/${parsed.data.providerId}`);
    revalidatePath("/");
    redirect(`/prestadores/${parsed.data.providerId}`);
  });
}

export async function commentAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const providerId = String(formData.get("providerId") ?? "");
    const body = String(formData.get("body") ?? "").trim();
    if (!providerId || body.length < 4) {
      return { error: "Escribí un comentario." };
    }

    await prisma.comment.create({
      data: {
        body,
        displayName: user.displayName,
        userId: user.id,
        providerId,
      },
    });

    revalidatePath(`/prestadores/${providerId}`);
    return { ok: true };
  });
}

export async function toggleFavoriteAction(providerId: string) {
  const user = await requireUser();
  const existing = await prisma.favorite.findUnique({
    where: { userId_providerId: { userId: user.id, providerId } },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { userId_providerId: { userId: user.id, providerId } },
    });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, providerId } });
  }

  revalidatePath(`/prestadores/${providerId}`);
  revalidatePath("/favoritos");
}

export async function reportAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const providerId = String(formData.get("providerId") ?? "");
    const reason = String(formData.get("reason") ?? "");
    const details = String(formData.get("details") ?? "").trim();

    const allowed = REPORT_REASONS.map((r) => r.id);
    if (!providerId || !allowed.includes(reason)) {
      return { error: "Elegí un motivo." };
    }
    if (details.length < 8) {
      return { error: "Contanos un poco más qué te resultó extraño." };
    }

    await prisma.report.create({
      data: {
        targetType: "provider",
        targetId: providerId,
        providerId,
        reason: reason as never,
        details,
        reporterId: user.id,
      },
    });

    const provider = await prisma.provider.findUnique({
      where: { id: providerId },
      select: { status: true },
    });
    if (
      provider &&
      (provider.status === "pending" || provider.status === "approved")
    ) {
      await prisma.provider.update({
        where: { id: providerId },
        data: { status: "reported" },
      });
    }

    revalidatePath("/moderacion");
    revalidatePath(`/prestadores/${providerId}`);
    return { ok: true };
  });
}
