import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  Heart,
  MapPin,
  Phone,
  BadgeCheck,
  MessageCircle,
} from "lucide-react";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { getProviderById, isFavorite } from "@/lib/queries";
import { telLink, whatsappLink } from "@/lib/phone";
import { tagLabel, timeAgo } from "@/lib/utils";
import { toggleFavoriteAction } from "@/app/actions/social";

export default async function ProviderPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ aviso?: string }>;
}) {
  const { id } = await params;
  const { aviso } = await searchParams;
  const provider = await getProviderById(id);
  if (!provider) notFound();

  const session = await auth();
  const fav = session?.user?.id ? await isFavorite(session.user.id, id) : false;
  const photo = provider.photos[0]?.url;
  const firstName = provider.name.split(" ")[0];
  const visible =
    provider.status === "approved" || session?.user?.role === "moderator";

  if (!visible) notFound();

  const reviews = [
    ...provider.recommendations.map((r) => ({
      id: r.id,
      name: r.user.displayName,
      body: r.comment,
      rating: r.rating,
      createdAt: r.createdAt,
      kind: "rec" as const,
    })),
    ...provider.comments.map((c) => ({
      id: c.id,
      name: c.displayName,
      body: c.body,
      rating: null as number | null,
      createdAt: c.createdAt,
      kind: "comment" as const,
    })),
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <AppShell>
      <div className="relative flex-1 pb-28">
        <header className="flex items-center justify-between px-4 pt-4">
          <Link href="/buscar" className="flex h-10 w-10 items-center justify-center rounded-full bg-mist">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          {session?.user && (
            <form action={toggleFavoriteAction.bind(null, id)}>
              <button
                type="submit"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-mist"
                aria-label="Favorito"
              >
                <Heart
                  className={fav ? "h-5 w-5 fill-coral text-coral" : "h-5 w-5 text-carbon"}
                  strokeWidth={1.75}
                />
              </button>
            </form>
          )}
        </header>

        {aviso === "telefono" && (
          <p className="mx-4 mt-3 rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand">
            Ese teléfono ya estaba cargado. Podés sumar tu recomendación acá.
          </p>
        )}

        <div className="mt-4 flex flex-col items-center px-4 text-center">
          <Avatar name={provider.name} src={photo} size="lg" />
          <h1 className="mt-3 font-serif text-2xl font-semibold text-carbon">{provider.name}</h1>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <RatingBadge value={provider.stats.avg} count={provider.stats.count} />
            <span className="inline-flex items-center gap-1 text-xs text-carbon/55">
              <MapPin className="h-3.5 w-3.5" />
              {provider.zone}
            </span>
          </div>
          {provider.stats.topTag && (
            <span className="mt-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              {tagLabel(provider.stats.topTag.id)}
            </span>
          )}
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {provider.source === "neighbor" && provider.stats.count > 0 && (
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">
                Recomendado por vecinos
              </span>
            )}
            {provider.source === "self" && (
              <span className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-carbon/70">
                Publicado por el prestador
              </span>
            )}
          </div>
        </div>

        <div className="mx-4 mt-6 grid grid-cols-3 gap-2">
          <TrustStat label="Lo contraté" value={provider.stats.hired} />
          <TrustStat label="Volvería a llamarlo" value={provider.stats.wouldCallAgain} />
          <TrustStat
            label="Respondió rápido"
            value={provider.stats.tagCounts.respondio_rapido ?? 0}
          />
        </div>

        <section className="mx-4 mt-6 rounded-2xl bg-white px-4 py-4 ring-1 ring-black/[0.04]">
          <h2 className="font-semibold text-carbon">Sobre {firstName}</h2>
          <p className="mt-2 text-sm leading-relaxed text-carbon/75">{provider.description}</p>
          <ul className="mt-3 space-y-1.5 text-sm text-carbon/80">
            {provider.license && (
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand" />
                {provider.license}
              </li>
            )}
            {provider.categories.map((c) => (
              <li key={c.categoryId} className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand" />
                {c.category.name}
              </li>
            ))}
            {provider.lastRecommendedAt && (
              <li className="text-xs text-carbon/50">
                Última recomendación {timeAgo(provider.lastRecommendedAt)}
              </li>
            )}
          </ul>
        </section>

        <section className="mx-4 mt-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-carbon">Lo que dicen los vecinos</h2>
            {session?.user && (
              <Link
                href={`/prestadores/${id}/recomendar`}
                className="text-xs font-semibold text-brand"
              >
                Recomendar
              </Link>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="rounded-2xl bg-white px-4 py-5 text-sm text-carbon/60 ring-1 ring-black/[0.04]">
              Todavía no hay comentarios. Si lo usaste, dejá tu experiencia.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {reviews.map((r) => (
                <article
                  key={`${r.kind}-${r.id}`}
                  className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-carbon">{r.name}</p>
                    <p className="text-[11px] text-carbon/45">{timeAgo(r.createdAt)}</p>
                  </div>
                  {r.rating && (
                    <div className="mt-1">
                      <RatingBadge value={r.rating} count={1} />
                    </div>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-carbon/75">{r.body}</p>
                </article>
              ))}
            </div>
          )}
          {session?.user && (
            <Link
              href={`/prestadores/${id}/comentar`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand"
            >
              <MessageCircle className="h-4 w-4" />
              Dejar un comentario
            </Link>
          )}
        </section>

        {session?.user && (
          <div className="mx-4 mt-6 mb-4 text-center">
            <Link href={`/prestadores/${id}/reportar`} className="text-xs font-semibold text-coral">
              Reportar ficha
            </Link>
          </div>
        )}
      </div>

      <div className="fixed bottom-[72px] left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-t from-paper via-paper to-transparent px-4 pb-3 pt-6">
        <div className="flex gap-2">
          <a
            href={whatsappLink(provider.whatsapp || provider.phone)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-[15px] font-semibold text-white"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
          <a
            href={telLink(provider.phone)}
            className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-brand bg-white py-3.5 text-[15px] font-semibold text-brand"
          >
            <Phone className="h-5 w-5" />
            Llamar
          </a>
        </div>
      </div>
    </AppShell>
  );
}

function TrustStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white px-2 py-3 text-center ring-1 ring-black/[0.04]">
      <p className="text-lg font-semibold text-brand">{value}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-carbon/65">{label}</p>
      <p className="text-[10px] text-carbon/40">vecinos</p>
    </div>
  );
}
