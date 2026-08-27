import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutAction } from "@/app/actions/auth";
import { prisma } from "@/lib/db";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default async function CuentaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/cuenta");

  const [owned, mine] = await Promise.all([
    prisma.provider.findFirst({
      where: { ownerId: session.user.id },
      select: { id: true, name: true, status: true },
    }),
    prisma.provider.findMany({
      where: {
        OR: [{ ownerId: session.user.id }, { createdById: session.user.id }],
        status: { notIn: ["duplicate", "rejected"] },
      },
      select: { id: true, name: true, status: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="font-serif text-2xl font-semibold">Perfil</h1>
      <div className="mt-4 rounded-2xl bg-card px-4 py-4 ring-1 ring-line">
        <p className="font-semibold">{session.user.name}</p>
        <p className="text-sm text-carbon/60">{session.user.displayName}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-carbon/40">
          {session.user.role === "moderator"
            ? "Moderador"
            : session.user.role === "provider"
              ? "Prestador"
              : "Vecino"}
        </p>
      </div>

      <div className="mt-4 flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-line">
        <Row href="/favoritos" label="Favoritos" />
        <Row href="/prestadores/nuevo" label="Publicar un servicio" />
        {owned ? (
          <Row href={`/prestadores/${owned.id}`} label={`Mi oficio · ${owned.name}`} />
        ) : (
          <Row href="/prestadores/nuevo?origen=propio" label="Publicar mi oficio" />
        )}
        {session.user.role === "moderator" && (
          <Row href="/moderacion" label="Panel admin" />
        )}
        <Row href="/faq" label="Preguntas frecuentes" />
      </div>

      {mine.length > 0 && (
        <section className="mt-5">
          <h2 className="text-sm font-semibold text-carbon">Mis publicaciones</h2>
          <div className="mt-2 flex flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-line">
            {mine.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between gap-2 border-b border-line px-4 py-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <StatusBadge status={p.status} />
                </div>
                <div className="flex shrink-0 gap-2">
                  <Link
                    href={`/prestadores/${p.id}`}
                    className="text-xs font-semibold text-brand-ink"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/prestadores/${p.id}/editar`}
                    className="text-xs font-semibold text-brand-ink"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <form action={logoutAction} className="mt-6">
        <SubmitButton
          pendingLabel="Saliendo…"
          className="w-full text-sm font-semibold text-coral"
        >
          Cerrar sesión
        </SubmitButton>
      </form>
    </div>
  );
}

function Row({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      prefetch
      className="border-b border-line px-4 py-3.5 text-sm last:border-0"
    >
      {label}
    </Link>
  );
}
