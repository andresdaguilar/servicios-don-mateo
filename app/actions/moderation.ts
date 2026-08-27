"use server";

import { revalidatePath } from "next/cache";
import { ProviderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireModerator } from "@/app/actions/auth";

async function log(userId: string, action: string, details?: string) {
  await prisma.moderationEvent.create({
    data: { userId, action, details },
  });
}

export async function setProviderStatus(providerId: string, status: ProviderStatus) {
  const user = await requireModerator();
  await prisma.provider.update({
    where: { id: providerId },
    data: {
      status,
      possibleDuplicate: status === "approved" ? false : undefined,
    },
  });
  await log(user.id, `status:${status}`, providerId);
  revalidatePath("/moderacion");
  revalidatePath(`/prestadores/${providerId}`);
  revalidatePath("/");
  revalidatePath("/buscar");
}

export async function resolveReport(reportId: string, resolution: string) {
  const user = await requireModerator();
  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "resolved",
      resolution,
      resolvedAt: new Date(),
    },
  });
  await log(user.id, "report:resolved", reportId);

  if (report.providerId && report.reason === "outdated") {
    await prisma.provider.update({
      where: { id: report.providerId },
      data: { status: "outdated" },
    });
  }

  revalidatePath("/moderacion");
}

export async function dismissReport(reportId: string) {
  const user = await requireModerator();
  const report = await prisma.report.update({
    where: { id: reportId },
    data: {
      status: "dismissed",
      resolution: "Sin acción",
      resolvedAt: new Date(),
    },
  });

  if (report.providerId) {
    const open = await prisma.report.count({
      where: { providerId: report.providerId, status: "open" },
    });
    if (open === 0) {
      const provider = await prisma.provider.findUnique({
        where: { id: report.providerId },
      });
      if (provider?.status === "reported") {
        await prisma.provider.update({
          where: { id: report.providerId },
          data: { status: "pending" },
        });
      }
    }
  }

  await log(user.id, "report:dismissed", reportId);
  revalidatePath("/moderacion");
}

export async function mergeProviders(canonicalId: string, duplicateId: string) {
  const user = await requireModerator();
  if (canonicalId === duplicateId) return;

  const [canonical, duplicate] = await Promise.all([
    prisma.provider.findUnique({ where: { id: canonicalId } }),
    prisma.provider.findUnique({
      where: { id: duplicateId },
      include: {
        recommendations: { include: { tags: true } },
        comments: true,
        favorites: true,
        photos: true,
        categories: true,
      },
    }),
  ]);

  if (!canonical || !duplicate) return;

  for (const rec of duplicate.recommendations) {
    const clash = await prisma.recommendation.findUnique({
      where: {
        userId_providerId: { userId: rec.userId, providerId: canonicalId },
      },
    });
    if (clash) {
      await prisma.recommendation.delete({ where: { id: rec.id } });
      continue;
    }
    await prisma.recommendation.update({
      where: { id: rec.id },
      data: { providerId: canonicalId },
    });
  }

  await prisma.comment.updateMany({
    where: { providerId: duplicateId },
    data: { providerId: canonicalId },
  });

  for (const fav of duplicate.favorites) {
    const clash = await prisma.favorite.findUnique({
      where: {
        userId_providerId: { userId: fav.userId, providerId: canonicalId },
      },
    });
    if (clash) {
      await prisma.favorite.delete({
        where: { userId_providerId: { userId: fav.userId, providerId: duplicateId } },
      });
    } else {
      await prisma.favorite.update({
        where: { userId_providerId: { userId: fav.userId, providerId: duplicateId } },
        data: { providerId: canonicalId },
      });
    }
  }

  await prisma.providerPhoto.updateMany({
    where: { providerId: duplicateId },
    data: { providerId: canonicalId },
  });

  for (const cat of duplicate.categories) {
    await prisma.providerCategory.upsert({
      where: {
        providerId_categoryId: {
          providerId: canonicalId,
          categoryId: cat.categoryId,
        },
      },
      update: {},
      create: { providerId: canonicalId, categoryId: cat.categoryId },
    });
  }

  await prisma.provider.update({
    where: { id: duplicateId },
    data: {
      status: "duplicate",
      duplicateOfId: canonicalId,
      possibleDuplicate: false,
    },
  });

  await prisma.provider.update({
    where: { id: canonicalId },
    data: { possibleDuplicate: false, status: "approved" },
  });

  await log(user.id, "merge", `${duplicateId} -> ${canonicalId}`);
  revalidatePath("/moderacion");
  revalidatePath(`/prestadores/${canonicalId}`);
}

export async function updateCategoryAction(
  categoryId: string,
  formData: FormData,
) {
  await requireModerator();
  const name = String(formData.get("name") ?? "").trim();
  const isUrgency = formData.get("isUrgency") === "on";
  if (!name) return;
  await prisma.category.update({
    where: { id: categoryId },
    data: { name, isUrgency },
  });
  revalidatePath("/moderacion");
  revalidatePath("/");
}
