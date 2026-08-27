"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { put } from "@vercel/blob";
import { PhotoKind, ProviderSource, ProviderStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { normalizePhone } from "@/lib/phone";
import { parseInstagram } from "@/lib/instagram";
import { parseWebsite } from "@/lib/website";
import { findProviderByPhone, findSimilarProviders, isPublicProviderStatus } from "@/lib/queries";
import { canEditProvider } from "@/lib/permissions";
import { requireUser } from "@/app/actions/auth";
import type { ActionState } from "@/app/actions/auth";
import { runAction } from "@/lib/errors";

const providerSchema = z.object({
  name: z.string().min(2, "Ingresá el nombre").max(80),
  description: z.string().max(600).optional(),
  phone: z.string().min(8, "Ingresá un teléfono"),
  instagram: z.string().max(80).optional(),
  website: z.string().max(200).optional(),
  zone: z.string().max(80).optional(),
  license: z.string().max(80).optional(),
  categoryIds: z.array(z.string()).min(1, "Elegí al menos un rubro"),
  source: z.enum(["neighbor", "self"]),
});

function parseContactExtras(data: { instagram?: string; website?: string }) {
  const instagramRaw = data.instagram?.trim() ?? "";
  const instagram = instagramRaw ? parseInstagram(instagramRaw) : null;
  if (instagramRaw && !instagram) {
    return { error: "El Instagram no parece válido. Usá el usuario, tipo @donmateo." };
  }
  const websiteRaw = data.website?.trim() ?? "";
  const website = websiteRaw ? parseWebsite(websiteRaw) : null;
  if (websiteRaw && !website) {
    return { error: "La web no parece válida. Usá el sitio, tipo donmateo.com.ar." };
  }
  return { instagram, website };
}

async function uploadNamedFiles(formData: FormData, field: string, max: number) {
  const files = formData.getAll(field).filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { urls: [] as string[] };
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      urls: [] as string[],
      error: "No se pudieron subir las fotos ahora. Probá de nuevo en un rato.",
    };
  }

  const urls: string[] = [];
  for (const file of files.slice(0, max)) {
    const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(0, 80) || "foto";
    const blob = await put(`prestadores/${field}/${Date.now()}-${safe}`, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    urls.push(blob.url);
  }
  return { urls };
}

async function uploadListingImages(formData: FormData) {
  const avatar = await uploadNamedFiles(formData, "avatar", 1);
  if (avatar.error) return avatar;
  const gallery = await uploadNamedFiles(formData, "photos", 4);
  if (gallery.error) return gallery;
  return { avatarUrls: avatar.urls, galleryUrls: gallery.urls };
}

export async function createProviderAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
    const parsed = providerSchema.safeParse({
      name: formData.get("name"),
      description: String(formData.get("description") ?? "") || undefined,
      phone: formData.get("phone"),
      instagram: String(formData.get("instagram") ?? "") || undefined,
      website: String(formData.get("website") ?? "") || undefined,
      zone: String(formData.get("zone") ?? "") || undefined,
      license: String(formData.get("license") ?? "") || undefined,
      categoryIds,
      source: formData.get("source") === "self" ? "self" : "neighbor",
    });

    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Revisá los datos e intentá de nuevo." };
    }

    const phone = normalizePhone(parsed.data.phone);
    if (phone.length < 10) return { error: "El teléfono no parece válido." };

    const extras = parseContactExtras(parsed.data);
    if ("error" in extras) return extras;
    const { instagram, website } = extras;

    const existing = await findProviderByPhone(phone);
    if (existing) {
      if (existing.deletedAt) {
        const mine =
          existing.ownerId === user.id || existing.createdById === user.id;
        if (mine) {
          redirect(`/prestadores/${existing.id}`);
        }
        return {
          error:
            "Ese teléfono ya está en una ficha borrada. Si es tuya, restaurala desde Perfil.",
        };
      }
      redirect(`/prestadores/${existing.id}?aviso=telefono`);
    }

    const similar = await findSimilarProviders(parsed.data.name);
    const selfPublish = parsed.data.source === "self";
    const status = ProviderStatus.pending;

    if (selfPublish) {
      const owned = await prisma.provider.findUnique({
        where: { ownerId: user.id },
        select: { id: true, name: true, deletedAt: true },
      });
      if (owned) {
        if (owned.deletedAt) {
          return {
            error: `Tu ficha (${owned.name}) está borrada. Restaurala desde tu perfil.`,
            href: `/prestadores/${owned.id}`,
            hrefLabel: "Ver mi ficha",
          };
        }
        return {
          error: `Ya publicaste un servicio (${owned.name}). Si querés cambiar algo, entrá a tu ficha.`,
          href: `/prestadores/${owned.id}`,
          hrefLabel: "Ver mi ficha",
        };
      }
    }

    const images = await uploadListingImages(formData);
    if ("error" in images) return { error: images.error };

    const photoRows = [
      ...(images.avatarUrls ?? []).map((url) => ({ url, kind: PhotoKind.profile })),
      ...(images.galleryUrls ?? []).map((url) => ({ url, kind: PhotoKind.gallery })),
    ];

    const provider = await prisma.provider.create({
      data: {
        name: parsed.data.name.trim(),
        description: parsed.data.description?.trim() ?? "",
        phone,
        whatsapp: phone,
        instagram,
        website,
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
        photos: photoRows.length ? { create: photoRows } : undefined,
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
    revalidatePath("/moderacion");
    redirect(`/prestadores/${provider.id}?aviso=publicada`);
  });
}

export async function updateProviderAction(
  providerId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  return runAction(async () => {
    const user = await requireUser();
    const provider = await prisma.provider.findUnique({ where: { id: providerId } });
    if (!provider) return { error: "No existe esa ficha." };

    const isOwner = provider.ownerId === user.id;
    const isCreator = provider.createdById === user.id;
    const isMod = user.role === "moderator";
    if (!isOwner && !isCreator && !isMod) {
      return { error: "No podés editar esta ficha." };
    }
    if (provider.deletedAt) {
      return { error: "Esta ficha está borrada. Restaurala para editarla." };
    }

    const categoryIds = formData.getAll("categoryIds").map(String).filter(Boolean);
    const parsed = providerSchema.omit({ source: true }).safeParse({
      name: formData.get("name"),
      description: String(formData.get("description") ?? "") || undefined,
      phone: formData.get("phone"),
      instagram: String(formData.get("instagram") ?? "") || undefined,
      website: String(formData.get("website") ?? "") || undefined,
      zone: String(formData.get("zone") ?? "") || undefined,
      license: String(formData.get("license") ?? "") || undefined,
      categoryIds,
    });
    if (!parsed.success) {
      return { error: parsed.error.issues[0]?.message ?? "Revisá los datos e intentá de nuevo." };
    }

    const phone = normalizePhone(parsed.data.phone);
    if (phone.length < 10) return { error: "El teléfono no parece válido." };

    const extras = parseContactExtras(parsed.data);
    if ("error" in extras) return extras;
    const { instagram, website } = extras;

    if (phone !== provider.phone) {
      const clash = await findProviderByPhone(phone);
      if (clash && clash.id !== provider.id) {
        return { error: "Ese teléfono ya está en otra ficha." };
      }
    }

    const images = await uploadListingImages(formData);
    if ("error" in images) return { error: images.error };

    const sensitive = phone !== provider.phone || parsed.data.name.trim() !== provider.name;
    const nextStatus =
      !isMod && (isOwner || isCreator) && sensitive ? ProviderStatus.pending : provider.status;

    await prisma.$transaction(async (tx) => {
      await tx.provider.update({
        where: { id: providerId },
        data: {
          name: parsed.data.name.trim(),
          description: parsed.data.description?.trim() ?? "",
          zone: parsed.data.zone?.trim() ?? "",
          license: parsed.data.license?.trim() || null,
          phone,
          whatsapp: phone,
          instagram,
          website,
          status: nextStatus,
        },
      });
      await tx.providerCategory.deleteMany({ where: { providerId } });
      await tx.providerCategory.createMany({
        data: parsed.data.categoryIds.map((categoryId) => ({ providerId, categoryId })),
      });
      if (images.avatarUrls?.length) {
        await tx.providerPhoto.deleteMany({
          where: { providerId, kind: PhotoKind.profile },
        });
        await tx.providerPhoto.create({
          data: { providerId, url: images.avatarUrls[0]!, kind: PhotoKind.profile },
        });
      }
      if (images.galleryUrls?.length) {
        await tx.providerPhoto.createMany({
          data: images.galleryUrls.map((url) => ({
            providerId,
            url,
            kind: PhotoKind.gallery,
          })),
        });
      }
    });

    revalidatePath(`/prestadores/${providerId}`);
    revalidatePath("/moderacion");
    revalidatePath("/");
    revalidatePath("/buscar");
    revalidatePath("/cuenta");
    redirect(`/prestadores/${providerId}?aviso=editada`);
  });
}

function revalidateListing(providerId: string) {
  revalidatePath(`/prestadores/${providerId}`);
  revalidatePath("/moderacion");
  revalidatePath("/");
  revalidatePath("/buscar");
  revalidatePath("/cuenta");
  revalidatePath("/favoritos");
}

async function loadManagedListing(providerId: string) {
  const user = await requireUser();
  const provider = await prisma.provider.findUnique({ where: { id: providerId } });
  if (!provider || !canEditProvider(user, provider)) {
    throw new Error("FORBIDDEN");
  }
  return provider;
}

export async function pauseProviderAction(providerId: string) {
  const provider = await loadManagedListing(providerId);
  if (provider.deletedAt || provider.pausedAt || !isPublicProviderStatus(provider.status)) {
    return;
  }

  await prisma.provider.update({
    where: { id: providerId },
    data: { pausedAt: new Date() },
  });
  revalidateListing(providerId);
}

export async function activateProviderAction(providerId: string) {
  const provider = await loadManagedListing(providerId);
  if (provider.deletedAt || !provider.pausedAt || !isPublicProviderStatus(provider.status)) {
    return;
  }

  await prisma.provider.update({
    where: { id: providerId },
    data: { pausedAt: null },
  });
  revalidateListing(providerId);
}

export async function deleteProviderAction(providerId: string) {
  const provider = await loadManagedListing(providerId);
  if (provider.deletedAt) return;

  await prisma.provider.update({
    where: { id: providerId },
    data: { deletedAt: new Date() },
  });
  revalidateListing(providerId);
}

export async function restoreProviderAction(providerId: string) {
  const provider = await loadManagedListing(providerId);
  if (!provider.deletedAt) return;

  await prisma.provider.update({
    where: { id: providerId },
    data: {
      deletedAt: null,
      pausedAt: isPublicProviderStatus(provider.status) ? null : provider.pausedAt,
    },
  });
  revalidateListing(providerId);
}
