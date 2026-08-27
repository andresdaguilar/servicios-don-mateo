import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { timeAgo } from "@/lib/utils";

export default async function SolicitudesPage() {
  const session = await auth();
  const requests = await prisma.request.findMany({
    include: {
      user: { select: { displayName: true } },
      category: true,
      _count: { select: { replies: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 40,
  });

  return (
    <>
      <div className="flex items-center justify-between px-4 pt-5">
        <h1 className="font-serif text-2xl font-semibold">Mensajes</h1>
        {session?.user && (
          <Link
            href="/solicitudes/nueva"
            prefetch
            className="rounded-full bg-brand px-3 py-1.5 text-sm font-semibold text-white"
          >
            Pedir
          </Link>
        )}
      </div>
      <p className="px-4 pt-1 text-sm text-carbon/60">
        Pedidos de recomendación entre vecinos. El contacto sigue siendo por WhatsApp.
      </p>
      <div className="mt-4 flex flex-col gap-2.5 px-4 pb-8">
        {requests.length === 0 && (
          <p className="rounded-2xl bg-card px-4 py-6 text-center text-sm text-carbon/60 ring-1 ring-line">
            Nadie pidió nada todavía.
          </p>
        )}
        {requests.map((r) => (
          <Link
            key={r.id}
            href={`/solicitudes/${r.id}`}
            prefetch
            className="rounded-2xl bg-card px-4 py-3 ring-1 ring-line"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-carbon">{r.user.displayName}</p>
              <span className="text-[11px] text-carbon/45">{timeAgo(r.createdAt)}</span>
            </div>
            <p className="mt-1 line-clamp-2 text-sm text-carbon/75">{r.body}</p>
            <div className="mt-2 flex items-center gap-2 text-[11px] text-carbon/50">
              {r.urgent && <span className="font-semibold text-coral">Urgente</span>}
              {r.category && <span>{r.category.name}</span>}
              <span>{r._count.replies} respuestas</span>
              {r.status === "closed" && <span>Cerrado</span>}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
