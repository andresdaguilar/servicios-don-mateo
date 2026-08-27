import { Prisma, ProviderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { aggregateTrust } from "@/lib/utils";
import { isSimilarName } from "@/lib/duplicates";

const providerInclude = {
  categories: { include: { category: true } },
  photos: true,
  recommendations: {
    include: { tags: true, user: { select: { displayName: true } } },
    orderBy: { createdAt: "desc" as const },
  },
  comments: { orderBy: { createdAt: "desc" as const } },
  _count: { select: { recommendations: true, comments: true, favorites: true } },
} satisfies Prisma.ProviderInclude;

export type ProviderWithRelations = Prisma.ProviderGetPayload<{
  include: typeof providerInclude;
}>;

export function withStats(provider: ProviderWithRelations) {
  return {
    ...provider,
    stats: aggregateTrust(provider.recommendations),
  };
}

export type ProviderCardModel = ReturnType<typeof withStats>;

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getPopularCategories() {
  const all = await getCategories();
  const popular = all.filter((c) =>
    ["gas", "plomeria", "electricidad", "bicicletas"].includes(c.slug),
  );
  return popular.length ? popular : all.slice(0, 4);
}

export async function searchProviders(opts: {
  q?: string;
  rubro?: string;
  zona?: string;
  urgency?: boolean;
}) {
  const q = opts.q?.trim();
  const providers = await prisma.provider.findMany({
    where: {
      status: ProviderStatus.approved,
      ...(opts.urgency
        ? { categories: { some: { category: { isUrgency: true } } } }
        : {}),
      ...(opts.rubro
        ? { categories: { some: { category: { slug: opts.rubro } } } }
        : {}),
      ...(opts.zona
        ? { zone: { contains: opts.zona, mode: "insensitive" } }
        : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { zone: { contains: q, mode: "insensitive" } },
              {
                categories: {
                  some: { category: { name: { contains: q, mode: "insensitive" } } },
                },
              },
            ],
          }
        : {}),
    },
    include: providerInclude,
    orderBy: [{ lastRecommendedAt: "desc" }, { createdAt: "desc" }],
  });

  return providers.map(withStats);
}

export async function getRecommendedNearby(limit = 8) {
  const providers = await prisma.provider.findMany({
    where: { status: ProviderStatus.approved },
    include: providerInclude,
    orderBy: [{ lastRecommendedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
  return providers.map(withStats);
}

export async function getProviderById(id: string) {
  const provider = await prisma.provider.findUnique({
    where: { id },
    include: providerInclude,
  });
  return provider ? withStats(provider) : null;
}

export async function findProviderByPhone(phone: string) {
  return prisma.provider.findUnique({
    where: { phone },
    include: { categories: { include: { category: true } } },
  });
}

export async function findSimilarProviders(name: string, excludeId?: string) {
  const candidates = await prisma.provider.findMany({
    where: {
      status: { notIn: [ProviderStatus.rejected, ProviderStatus.duplicate] },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true, name: true, phone: true, status: true },
  });
  return candidates.filter((p) => isSimilarName(p.name, name));
}

export async function getUrgencyContacts() {
  return prisma.urgencyContact.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getFavorites(userId: string) {
  const favs = await prisma.favorite.findMany({
    where: { userId },
    include: { provider: { include: providerInclude } },
    orderBy: { createdAt: "desc" },
  });
  return favs
    .filter((f) => f.provider.status === ProviderStatus.approved)
    .map((f) => withStats(f.provider));
}

export async function isFavorite(userId: string, providerId: string) {
  const row = await prisma.favorite.findUnique({
    where: { userId_providerId: { userId, providerId } },
  });
  return Boolean(row);
}
