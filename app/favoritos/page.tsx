import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { getFavorites } from "@/lib/queries";

export default async function FavoritosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/favoritos");
  const favorites = await getFavorites(session.user.id);

  return (
    <>
      <h1 className="px-4 pt-5 font-serif text-2xl font-semibold">Favoritos</h1>
      <div className="mt-4 flex flex-col gap-2.5 px-4 pb-8">
        {favorites.length === 0 ? (
          <div className="rounded-2xl bg-card px-4 py-8 text-center ring-1 ring-line">
            <p className="text-sm text-carbon/65">Todavía no guardaste contactos.</p>
            <Link href="/buscar" className="mt-3 inline-block text-sm font-semibold text-brand-ink">
              Buscar servicios
            </Link>
          </div>
        ) : (
          favorites.map((p) => <ProviderCard key={p.id} provider={p} />)
        )}
      </div>
    </>
  );
}
