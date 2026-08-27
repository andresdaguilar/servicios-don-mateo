"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { ProviderSource, ProviderStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { findProviderByPhone, findSimilarProviders } from "@/lib/queries";
import { requireUser } from "@/app/actions/auth";
import type { ActionState } from "@/app/actions/auth";

const providerSchema = z.object({
  name: z.string().min(2, "Ingresá el nombre").max(80),
  description: z.string().max(600).optional(),
  phone: z.string().min(8, "Ingresá un teléfono"),
  zone: z.string().max(80).optional(),
  license: z.string().max(80).optional(),
  categoryIds: z.array(z.string()).min(1, "Elegí al menos un rubro"),
  source: z.enum(["neighbor", "self"]),
});

async function uploadPhotos(formData: FormData) {
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return [];
  if (!process.env.BLOB_READ_WRITE_TOKEN) return [];

  const urls: string[] = [];
  for (const file of files.slice(0, 4)) {
    const blob = await put(`prestadores/${Date.now()}-${file.name}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    urls.push(blob.url);
  }
  return urls;
}

export async function createProviderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
  const parsed = providerSchema.safeParse({
    name: formData.get("name"),
    description: String(formData.get("description") ?? "") || undefined,
    phone: formData.get("phone"),
    zone: String(formData.get("zone") ?? "") || undefined,
    license: String(formData.get("license") ?? "") || undefined,
    categoryIds,
    source: formData.get("source") === "self" ? "self" : "neighbor",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const phone = normalizePhone(parsed.data.phone);
  if (phone.length < 10) return { error: "El teléfono no parece válido." };

  const existing = await findProviderByPhone(phone);
  if (existing) {
    redirect(`/prestadores/${existing.id}?aviso=telefono`);
  }

  const similar = await findSimilarProviders(parsed.data.name);
  const selfPublish = parsed.data.source === "self";
  const status =
    similar.length > 0 || selfPublish ? ProviderStatus.pending : ProviderStatus.approved;

  const photos = await uploadPhotos(formData);

  const provider = await prisma.provider.create({
    data: {
      name: parsed.data.name.trim(),
      description: parsed.data.description?.trim() ?? "",
      phone,
      whatsapp: phone,
      zone: parsed.data.zone?.trim() ?? "",
      license: parsed.data.license?.trim() || null,
      status,
      source: selfPublish ? ProviderSource.self : ProviderSource.neighbor,
      possibleDuplicate: similar.length > 0,
      createdById: user.id,
      ownerId: selfPublish ? user.id : null,
      lastRecommendedAt: selfPublish ? null : new Date(),
      categories: {
        create: parsed.data.categoryIds.map((categoryId) => ({ categoryId })),
      },
      photos: photos.length
        ? { create: photos.map((url) => ({ url })) }
        : undefined,
    },
  });

  if (selfPublish) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role: user.role === "moderator" ? "moderator" : "provider" },
    });
  }

  revalidatePath("/");
  revalidatePath("/buscar");
  if (status === ProviderStatus.approved) {
    redirect(`/prestadores/${provider.id}`);
  }
  redirect(`/prestadores/nuevo/gracias`);
}

export async function updateProviderAction(providerId: string, formData: FormData) {
  const user = await requireUser();
  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider) return { error: "No existe esa ficha." };

  const isOwner = provider.ownerId === user.id;
  const isMod = user.role === "moderator";
  if (!isOwner && !isMod) return { error: "No podés editar esta ficha." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const zone = String(formData.get("zone") ?? "").trim();
  const license = String(formData.get("license") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  if (name.length < 2) {
    return { error: "Completá el nombre." };
  }

  const phone = phoneRaw ? normalizePhone(phoneRaw) : provider.phone;
  if (phone !== provider.phone) {
    const clash = await findProviderByPhone(phone);
    if (clash && clash.id !== provider.id) {
      return { error: "Ese teléfono ya está en otra ficha." };
    }
  }

  const sensitive = phone !== provider.phone || name !== provider.name;
  await prisma.provider.update({
    where: { id: providerId },
    data: {
      name,
      description,
      zone,
      license: license || null,
      phone,
      whatsapp: phone,
      status: isOwner && sensitive ? ProviderStatus.pending : provider.status,
    },
  });

  revalidatePath(`/prestadores/${providerId}`);
  revalidatePath("/moderacion");
  return { ok: true };
}
