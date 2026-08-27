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

/** Se ven en el barrio hasta que un moderador las da de baja. */
export const PUBLIC_PROVIDER_STATUSES: ProviderStatus[] = [
  ProviderStatus.pending,
  ProviderStatus.approved,
  ProviderStatus.reported,
];

export const LISTED_PROVIDER_WHERE = {
  status: { in: PUBLIC_PROVIDER_STATUSES },
  pausedAt: null,
  deletedAt: null,
} satisfies Prisma.ProviderWhereInput;

export function isPublicProviderStatus(status: ProviderStatus) {
  return PUBLIC_PROVIDER_STATUSES.includes(status);
}

export function isListedProvider(provider: {
  status: ProviderStatus;
  pausedAt: Date | null;
  deletedAt: Date | null;
}) {
  return (
    isPublicProviderStatus(provider.status) &&
    !provider.pausedAt &&
    !provider.deletedAt
  );
}

export function listingStatus(provider: {
  status: string;
  pausedAt: Date | null;
  deletedAt: Date | null;
}) {
  if (provider.deletedAt) return "deleted";
  if (provider.pausedAt) return "paused";
  return provider.status;
}

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
      ...LISTED_PROVIDER_WHERE,
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
    where: { ...LISTED_PROVIDER_WHERE },
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
      deletedAt: null,
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
    .filter((f) => isListedProvider(f.provider))
    .map((f) => withStats(f.provider));
}

export async function isFavorite(userId: string, providerId: string) {
  const row = await prisma.favorite.findUnique({
    where: { userId_providerId: { userId, providerId } },
  });
  return Boolean(row);
}
