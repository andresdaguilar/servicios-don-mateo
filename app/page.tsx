import Link from "next/link";
import { Heart, House, ShieldCheck, Users } from "lucide-react";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
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
    <AppShell>
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
          <Link href="/buscar" className="text-xs font-medium text-brand">
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/buscar?rubro=${cat.slug}`}
              className="flex flex-col items-center gap-2 rounded-2xl bg-white py-3 ring-1 ring-black/[0.04]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand">
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
          <Link href="/urgencias" className="text-xs font-medium text-coral">
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
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: ShieldCheck, label: "Vecinos reales" },
            { icon: Heart, label: "Recomendaciones de confianza" },
            { icon: Users, label: "Apoyamos lo local" },
            { icon: House, label: "Comunidad que ayuda" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 rounded-xl bg-white px-3 py-2.5 text-[12px] font-medium text-carbon/80 ring-1 ring-black/[0.04]"
            >
              <item.icon className="h-4 w-4 text-brand" strokeWidth={1.75} />
              {item.label}
            </div>
          ))}
        </div>
        <Link
          href="/faq"
          className="mt-4 flex items-center justify-center text-sm font-medium text-brand"
        >
          Preguntas frecuentes
        </Link>
      </section>
    </AppShell>
  );
}

function EmptyHome() {
  return (
    <div className="rounded-2xl bg-white px-4 py-6 text-center ring-1 ring-black/[0.04]">
      <p className="text-sm font-medium text-carbon">Todavía no hay fichas publicadas.</p>
      <p className="mt-1 text-sm text-carbon/60">
        Cargá al primer prestador del barrio.
      </p>
      <Link
        href="/prestadores/nuevo"
        className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
      >
        Publicar servicio
      </Link>
    </div>
  );
}
