import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppShell } from "@/components/layout/AppShell";
import { logoutAction } from "@/app/actions/auth";
import { prisma } from "@/lib/db";

export default async function CuentaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/cuenta");

  const owned = await prisma.provider.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, status: true },
  });

  return (
    <AppShell>
      <div className="px-4 pt-5 pb-8">
        <h1 className="font-serif text-2xl font-semibold">Perfil</h1>
        <div className="mt-4 rounded-2xl bg-white px-4 py-4 ring-1 ring-black/[0.04]">
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

        <div className="mt-4 flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-black/[0.04]">
          <Row href="/favoritos" label="Favoritos" />
          <Row href="/prestadores/nuevo?origen=vecino" label="Recomendar un prestador" />
          <Row href="/prestadores/nuevo" label="Publicar mi servicio" />
          <Row href="/solicitudes/nueva" label="Pedir recomendación" />
          {owned && <Row href={`/prestadores/${owned.id}`} label={`Mi ficha · ${owned.name}`} />}
          {session.user.role === "moderator" && (
            <Row href="/moderacion" label="Panel de confianza" />
          )}
        </div>

        <form action={logoutAction} className="mt-6">
          <button type="submit" className="w-full text-sm font-semibold text-coral">
            Cerrar sesión
          </button>
        </form>
      </div>
    </AppShell>
  );
}

function Row({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="border-b border-black/[0.04] px-4 py-3.5 text-sm last:border-0"
    >
      {label}
    </Link>
  );
}
