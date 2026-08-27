import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Heart,
  MapPin,
  Phone,
  BadgeCheck,
  MessageCircle,
  Globe,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { auth } from "@/auth";
import { Avatar } from "@/components/ui/Avatar";
import { RatingBadge } from "@/components/ui/RatingBadge";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ListingActions } from "@/components/providers/ListingActions";
import { SubmitButton } from "@/components/ui/SubmitButton";
import {
  getProviderById,
  isFavorite,
  isListedProvider,
  isPublicProviderStatus,
  listingStatus,
} from "@/lib/queries";
import { telLink, whatsappLink } from "@/lib/phone";
import { formatInstagram, instagramLink } from "@/lib/instagram";
import { formatWebsite } from "@/lib/website";
import { tagLabel, timeAgo } from "@/lib/utils";
import { toggleFavoriteAction } from "@/app/actions/social";
import { setProviderStatus } from "@/app/actions/moderation";
import { canEditProvider } from "@/lib/permissions";
import { listingPhotos } from "@/lib/photos";

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
  const { avatarUrl, gallery } = listingPhotos(provider.photos);
  const favCount = provider._count.favorites;
  const firstName = provider.name.split(" ")[0];
  const isMod = session?.user?.role === "moderator";
  const canEdit = canEditProvider(session?.user, provider);
  const visible = isListedProvider(provider) || isMod || canEdit;

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
      <div className="flex flex-1 flex-col">
        <div className="flex-1 pb-4">
        {aviso === "telefono" && (
          <p className="mx-4 mt-3 rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand-ink">
            Ese teléfono ya estaba cargado. Podés sumar tu recomendación acá.
          </p>
        )}
        {aviso === "publicada" && (
          <p className="mx-4 mt-3 rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand-ink">
            Ya se ve en el barrio. Un moderador la revisa si hace falta o si alguien la reporta.
          </p>
        )}
        {aviso === "editada" && (
          <p className="mx-4 mt-3 rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand-ink">
            Guardamos los cambios.
          </p>
        )}
        {canEdit && provider.deletedAt && (
          <p className="mx-4 mt-3 rounded-xl bg-coral/15 px-3 py-2 text-sm text-coral">
            Esta ficha está borrada. Los vecinos no la ven. Podés restaurarla cuando quieras.
          </p>
        )}
        {canEdit && provider.pausedAt && !provider.deletedAt && (
          <p className="mx-4 mt-3 rounded-xl bg-mist px-3 py-2 text-sm text-carbon/75">
            Esta ficha está desactivada. No aparece en el barrio hasta que la actives.
          </p>
        )}

        <div className="mt-4 flex flex-col items-center px-4 text-center">
          <div className="relative">
            <Avatar name={provider.name} src={avatarUrl} size="lg" />
            {session?.user ? (
              <form
                action={toggleFavoriteAction.bind(null, id)}
                className="absolute -right-3 -top-1"
              >
                <SubmitButton
                  pendingOnlySpinner
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-line"
                  aria-label={fav ? "Quitar de favoritos" : "Guardar en favoritos"}
                >
                  <Heart
                    className={fav ? "h-5 w-5 fill-coral text-coral" : "h-5 w-5 text-carbon"}
                    strokeWidth={1.75}
                  />
                </SubmitButton>
              </form>
            ) : null}
          </div>
          <h1 className="mt-3 font-serif text-2xl font-semibold text-carbon">{provider.name}</h1>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <RatingBadge value={provider.stats.avg} count={provider.stats.count} />
            <span className="inline-flex items-center gap-1 text-xs text-carbon/55">
              <Heart
                className={`h-3.5 w-3.5 ${fav ? "fill-coral text-coral" : ""}`}
                strokeWidth={1.75}
              />
              {favCount === 0
                ? "Sin favoritos aún"
                : favCount === 1
                  ? "1 favorito"
                  : `${favCount} favoritos`}
            </span>
            {provider.zone ? (
              <span className="inline-flex items-center gap-1 text-xs text-carbon/55">
                <MapPin className="h-3.5 w-3.5" />
                {provider.zone}
              </span>
            ) : null}
          </div>
          {provider.stats.topTag && (
            <span className="mt-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-ink">
              {tagLabel(provider.stats.topTag.id)}
            </span>
          )}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {(isMod || canEdit) && <StatusBadge status={listingStatus(provider)} />}
            {provider.source === "neighbor" && provider.stats.count > 0 && (
              <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand-ink">
                Recomendado por vecinos
              </span>
            )}
            {canEdit && !provider.deletedAt && (
              <Link
                href={`/prestadores/${id}/editar`}
                className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-brand-ink"
              >
                Editar ficha
              </Link>
            )}
          </div>
          {canEdit && (
            <div className="mt-3 flex justify-center">
              <ListingActions
                providerId={id}
                paused={Boolean(provider.pausedAt)}
                deleted={Boolean(provider.deletedAt)}
                canToggle={isPublicProviderStatus(provider.status)}
              />
            </div>
          )}
        </div>

        {gallery.length > 0 && (
          <section className="mx-4 mt-6">
            <h2 className="mb-3 font-semibold text-carbon">Fotos</h2>
            <div className="grid grid-cols-2 gap-2">
              {gallery.map((photo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo.url}
                  src={photo.url}
                  alt={`Foto de ${provider.name}`}
                  className="aspect-[4/3] w-full rounded-2xl object-cover ring-1 ring-line"
                />
              ))}
            </div>
          </section>
        )}

        <div className="mx-4 mt-6 grid grid-cols-3 gap-2">
          <TrustStat label="Lo contraté" value={provider.stats.hired} />
          <TrustStat label="Volvería a llamarlo" value={provider.stats.wouldCallAgain} />
          <TrustStat
            label="Respondió rápido"
            value={provider.stats.tagCounts.respondio_rapido ?? 0}
          />
        </div>

        <section className="mx-4 mt-6 rounded-2xl bg-card px-4 py-4 ring-1 ring-line">
          <h2 className="font-semibold text-carbon">Sobre {firstName}</h2>
          {provider.description ? (
            <p className="mt-2 text-sm leading-relaxed text-carbon/75">{provider.description}</p>
          ) : (
            <p className="mt-2 text-sm text-carbon/50">Sin descripción todavía.</p>
          )}
          <ul className="mt-3 space-y-1.5 text-sm text-carbon/80">
            {provider.website && (
              <li>
                <a
                  href={provider.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-ink"
                >
                  <Globe className="h-4 w-4" />
                  {formatWebsite(provider.website)}
                </a>
              </li>
            )}
            {provider.instagram && (
              <li>
                <a
                  href={instagramLink(provider.instagram)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-brand-ink"
                >
                  <InstagramIcon className="h-4 w-4" />
                  {formatInstagram(provider.instagram)}
                </a>
              </li>
            )}
            {provider.license && (
              <li className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand-ink" />
                {provider.license}
              </li>
            )}
            {provider.categories.map((c) => (
              <li key={c.categoryId} className="flex items-center gap-2">
                <BadgeCheck className="h-4 w-4 text-brand-ink" />
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
            {session?.user && isListedProvider(provider) && (
              <Link
                href={`/prestadores/${id}/recomendar`}
                className="text-xs font-semibold text-brand-ink"
              >
                Recomendar
              </Link>
            )}
          </div>
          {reviews.length === 0 ? (
            <p className="rounded-2xl bg-card px-4 py-5 text-sm text-carbon/60 ring-1 ring-line">
              Todavía no hay comentarios. Si lo usaste, dejá tu experiencia.
            </p>
          ) : (
            <div className="flex flex-col gap-2.5">
              {reviews.map((r) => (
                <article
                  key={`${r.kind}-${r.id}`}
                  className="rounded-2xl bg-card px-4 py-3 ring-1 ring-line"
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
          {session?.user && isListedProvider(provider) && (
            <Link
              href={`/prestadores/${id}/comentar`}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-ink"
            >
              <MessageCircle className="h-4 w-4" />
              Dejar un comentario
            </Link>
          )}
        </section>

        {isMod && (
          <div className="mx-4 mt-5 rounded-2xl bg-card px-4 py-3 ring-1 ring-line">
            <p className="text-xs font-semibold uppercase tracking-wide text-carbon/45">
              Moderación
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {provider.status !== "approved" && (
                <form action={setProviderStatus.bind(null, id, "approved")}>
                  <SubmitButton className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white">
                    Marcar revisada
                  </SubmitButton>
                </form>
              )}
              {isPublicProviderStatus(provider.status) && !provider.deletedAt && (
                <form action={setProviderStatus.bind(null, id, "hidden")}>
                  <SubmitButton className="rounded-full bg-coral px-3 py-1.5 text-xs font-semibold text-white">
                    Dar de baja
                  </SubmitButton>
                </form>
              )}
              {!provider.deletedAt && (
              <Link
                href={`/prestadores/${id}/editar`}
                className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold"
              >
                Editar
              </Link>
              )}
              <Link
                href="/moderacion?tab=reportes"
                className="rounded-full bg-mist px-3 py-1.5 text-xs font-semibold"
              >
                Ver reportes
              </Link>
            </div>
          </div>
        )}

        {isListedProvider(provider) && (
        <div className="mx-4 mt-5 mb-4">
          {session?.user ? (
            <Link
              href={`/prestadores/${id}/reportar`}
              className="flex w-full items-center justify-center rounded-2xl border border-coral py-3 text-sm font-semibold text-coral"
            >
              Reportar publicación
            </Link>
          ) : (
            <Link
              href={`/login?from=/prestadores/${id}/reportar`}
              className="flex w-full items-center justify-center rounded-2xl border border-coral py-3 text-sm font-semibold text-coral"
            >
              Reportar publicación
            </Link>
          )}
        </div>
        )}
        </div>

        <div className="sticky bottom-0 z-10 bg-paper px-4 py-3">
          <ContactBar
            phone={provider.whatsapp || provider.phone}
            instagram={provider.instagram}
            website={provider.website}
          />
        </div>
      </div>
  );
}

function ContactBar({
  phone,
  instagram,
  website,
}: {
  phone: string;
  instagram: string | null;
  website: string | null;
}) {
  const extras = Boolean(instagram || website);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <a
          href={whatsappLink(phone)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-[15px] font-semibold text-white"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>
        <a
          href={telLink(phone)}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-brand bg-card py-3.5 text-[15px] font-semibold text-brand-ink"
        >
          <Phone className="h-5 w-5" />
          Llamar
        </a>
      </div>
      {extras ? (
        <div className="flex gap-2">
          {instagram ? (
            <a
              href={instagramLink(instagram)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#C13584] py-2.5 text-[13px] font-semibold text-white"
            >
              <InstagramIcon className="h-4 w-4" />
              Instagram
            </a>
          ) : null}
          {website ? (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-mist py-2.5 text-[13px] font-semibold text-brand-ink"
            >
              <Globe className="h-4 w-4" />
              Web
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function TrustStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-card px-2 py-3 text-center ring-1 ring-line">
      <p className="text-lg font-semibold text-brand-ink">{value}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-carbon/65">{label}</p>
      <p className="text-[10px] text-carbon/40">vecinos</p>
    </div>
  );
}
