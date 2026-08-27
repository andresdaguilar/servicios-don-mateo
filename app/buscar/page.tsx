import Link from "next/link";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { SearchBar } from "@/components/ui/SearchBar";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { getCategories, searchProviders } from "@/lib/queries";
import { cn } from "@/lib/utils";

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

  return (
    <AppShell backHref="/">
      <div className="px-4 pt-4">
        <SearchBar defaultValue={q ?? ""} showFilters />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          <Chip href="/buscar" active={!rubro}>
            Todos
          </Chip>
          {categories
            .filter((c) => !["salud", "seguridad", "administracion"].includes(c.slug))
            .map((c) => (
              <Chip key={c.id} href={`/buscar?rubro=${c.slug}`} active={rubro === c.slug}>
                {c.name}
              </Chip>
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4">
        {results.length === 0 ? (
          <div className="rounded-2xl bg-white px-4 py-8 text-center ring-1 ring-black/[0.04]">
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

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium",
        active ? "bg-brand text-white" : "bg-white text-carbon ring-1 ring-black/[0.08]",
      )}
    >
      {children}
    </Link>
  );
}
