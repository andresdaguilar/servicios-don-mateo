import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { AppShell, ScreenHeader } from "@/components/layout/AppShell";
import { ReplyForm } from "@/components/forms/ReplyForm";
import { closeRequestAction } from "@/app/actions/requests";
import { timeAgo } from "@/lib/utils";

export default async function SolicitudDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      user: { select: { displayName: true, id: true } },
      category: true,
      replies: {
        include: {
          user: { select: { displayName: true } },
          provider: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
  if (!request) notFound();

  const providers = await prisma.provider.findMany({
    where: { status: "approved" },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
    take: 80,
  });

  const canClose =
    session?.user &&
    (session.user.id === request.user.id || session.user.role === "moderator") &&
    request.status === "open";

  return (
    <AppShell>
      <ScreenHeader
        left={
          <Link
            href="/solicitudes"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mist"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        }
        title="Pedido"
      />
      <div className="px-4 pb-8">
        <div className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/[0.04]">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{request.user.displayName}</p>
            <p className="text-[11px] text-carbon/45">{timeAgo(request.createdAt)}</p>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-carbon/80">{request.body}</p>
          <div className="mt-2 flex gap-2 text-[11px] text-carbon/50">
            {request.urgent && <span className="font-semibold text-coral">Urgente</span>}
            {request.category && <span>{request.category.name}</span>}
          </div>
        </div>

        {canClose && (
          <form action={closeRequestAction.bind(null, request.id)} className="mt-3">
            <button type="submit" className="text-xs font-semibold text-carbon/50">
              Marcar como resuelto
            </button>
          </form>
        )}

        <h2 className="mt-6 text-sm font-semibold">Respuestas</h2>
        <div className="mt-2 flex flex-col gap-2">
          {request.replies.length === 0 && (
            <p className="text-sm text-carbon/55">Nadie respondió todavía.</p>
          )}
          {request.replies.map((r) => (
            <article key={r.id} className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]">
              <p className="text-sm font-semibold">{r.user.displayName}</p>
              <p className="mt-1 text-sm text-carbon/75">{r.body}</p>
              {r.provider && (
                <Link
                  href={`/prestadores/${r.provider.id}`}
                  className="mt-2 inline-block text-sm font-semibold text-brand"
                >
                  Ver ficha de {r.provider.name}
                </Link>
              )}
            </article>
          ))}
        </div>

        {session?.user && request.status === "open" ? (
          <ReplyForm requestId={request.id} providers={providers} />
        ) : !session?.user ? (
          <Link href="/login" className="mt-4 block text-sm font-semibold text-brand">
            Entrá para responder
          </Link>
        ) : null}
      </div>
    </AppShell>
  );
}
