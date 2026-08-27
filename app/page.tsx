import Link from "next/link";
import { Check } from "lucide-react";
import { auth } from "@/auth";
import { SearchBar } from "@/components/ui/SearchBar";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { CategoryGlyph } from "@/components/ui/CategoryGlyph";
import { getPopularCategories, getRecommendedNearby } from "@/lib/queries";

export default async function HomePage() {
  const session = await auth();
  const [categories, recommended] = await Promise.all([
    getPopularCategories(),
    getRecommendedNearby(6),
  ]);

  const hello = session?.user?.displayName
    ? `Hola, ${session.user.displayName.split(" ")[0]}`
    : "Hola, vecino";

  return (
    <>
      <div className="px-4 pt-6">
        <h1 className="font-serif text-[28px] font-semibold leading-tight text-carbon">
          {hello} 👋
          <span className="mt-1 block text-[22px] font-medium text-carbon/80">
            ¿En qué podemos ayudarte?
          </span>
        </h1>
        <SearchBar className="mt-5" />
      </div>

      <section className="px-4 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-carbon">Categorías populares</h2>
          <Link href="/buscar" prefetch className="text-xs font-medium text-brand-ink">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/buscar?rubro=${cat.slug}`}
              prefetch
              className="flex flex-col items-center gap-2 rounded-2xl bg-card py-3 ring-1 ring-line"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-ink">
                <CategoryGlyph icon={cat.icon} className="h-[18px] w-[18px]" />
              </span>
              <span className="text-[11px] font-medium text-carbon">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-4 pt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-carbon">Recomendados cerca tuyo</h2>
          <Link href="/urgencias" prefetch className="text-xs font-medium text-coral">
            Urgencias
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {recommended.length === 0 ? (
            <EmptyHome />
          ) : (
            recommended.map((p) => <ProviderCard key={p.id} provider={p} />)
          )}
        </div>
      </section>

      <section className="px-4 py-8">
        <div className="rounded-2xl bg-card px-4 py-4 ring-1 ring-line">
          <ul className="flex flex-col gap-2.5">
            {[
              "Vecinos reales",
              "Recomendaciones de confianza",
              "Apoyamos lo local",
              "Comunidad que ayuda",
            ].map((label) => (
              <li key={label} className="flex items-center gap-2.5 text-sm text-carbon/80">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-ink"
                  aria-hidden
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/faq"
          prefetch
          className="mt-4 flex items-center justify-center text-sm font-medium text-brand-ink"
        >
          Preguntas frecuentes
        </Link>
      </section>
    </>
  );
}

function EmptyHome() {
  return (
    <div className="rounded-2xl bg-card px-4 py-6 text-center ring-1 ring-line">
      <p className="text-sm font-medium text-carbon">Todavía no hay fichas publicadas.</p>
      <p className="mt-1 text-sm text-carbon/60">
        Cargá al primer prestador del barrio.
      </p>
      <Link
        href="/prestadores/nuevo"
        className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Publicar un servicio
      </Link>
    </div>
  );
}
