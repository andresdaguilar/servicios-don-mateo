import Link from "next/link";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { SearchBar } from "@/components/ui/SearchBar";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { getCategories, searchProviders } from "@/lib/queries";

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; rubro?: string; zona?: string }>;
}) {
  const { q, rubro, zona } = await searchParams;
  const [categories, results] = await Promise.all([
    getCategories(),
    searchProviders({ q, rubro, zona }),
  ]);
  await auth();

  const selected = categories.find((c) => c.slug === rubro);

  return (
    <AppShell backHref="/">
      <div className="px-4 pt-4">
        <h1 className="font-serif text-2xl font-semibold">
          {selected?.name ?? "Todas las categorías"}
        </h1>
        <SearchBar className="mt-3" defaultValue={q ?? ""} rubro={rubro} />
        <div className="mt-3">
          <CategorySelect
            categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
            value={rubro}
            q={q}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4">
        {results.length === 0 ? (
          <div className="rounded-2xl bg-card px-4 py-8 text-center ring-1 ring-line">
            <p className="font-medium text-carbon">No encontramos eso todavía.</p>
            <p className="mt-1 text-sm text-carbon/60">
              Podés cargar un prestador si lo conocés.
            </p>
            <Link
              href="/prestadores/nuevo?origen=vecino"
              className="mt-4 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white"
            >
              Cargar prestador
            </Link>
          </div>
        ) : (
          results.map((p) => <ProviderCard key={p.id} provider={p} />)
        )}
      </div>
    </AppShell>
  );
}
