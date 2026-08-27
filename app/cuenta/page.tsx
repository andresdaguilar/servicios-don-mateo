import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logoutAction } from "@/app/actions/auth";
import { prisma } from "@/lib/db";
import { SubmitButton } from "@/components/ui/SubmitButton";

export default async function CuentaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login?from=/cuenta");

  const owned = await prisma.provider.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true, status: true },
  });

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
            <Row href={`/prestadores/${owned.id}`} label={`Mi ficha · ${owned.name}`} />
          ) : (
            <Row href="/prestadores/nuevo?origen=propio" label="Publicar mi oficio" />
          )}
          {session.user.role === "moderator" && (
            <Row href="/moderacion" label="Moderar publicaciones" />
          )}
          <Row href="/faq" label="Preguntas frecuentes" />
        </div>

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
