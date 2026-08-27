import Link from "next/link";
import { Shield } from "lucide-react";
import { ProviderStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  dismissReport,
  mergeProviders,
  resolveReport,
  setProviderStatus,
  updateCategoryAction,
} from "@/app/actions/moderation";
import { REPORT_REASONS } from "@/lib/constants";
import { PUBLIC_PROVIDER_STATUSES } from "@/lib/queries";
import { cn, timeAgo } from "@/lib/utils";

const TABS = [
  { id: "reportes", label: "Reportes" },
  { id: "pendientes", label: "Pendientes" },
  { id: "publicaciones", label: "Publicaciones" },
  { id: "duplicados", label: "Duplicados" },
  { id: "historial", label: "Historial" },
  { id: "categorias", label: "Categorías" },
] as const;

export default async function ModeracionPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: tabRaw } = await searchParams;
  const tab = TABS.some((t) => t.id === tabRaw) ? tabRaw : "reportes";

  const [openReports, pending, listed, duplicates, events, categories, allProviders] =
    await Promise.all([
      prisma.report.findMany({
        where: { status: "open" },
        include: {
          reporter: { select: { displayName: true } },
          provider: { select: { id: true, name: true, status: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.provider.findMany({
        where: { status: { in: [ProviderStatus.pending, ProviderStatus.reported] } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.provider.findMany({
        where: { status: { in: PUBLIC_PROVIDER_STATUSES } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.provider.findMany({
        where: {
          OR: [{ possibleDuplicate: true }, { status: ProviderStatus.duplicate }],
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.moderationEvent.findMany({
        include: { user: { select: { displayName: true } } },
        orderBy: { createdAt: "desc" },
        take: 40,
      }),
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.provider.findMany({
        where: { status: { notIn: [ProviderStatus.duplicate, ProviderStatus.rejected] } },
        select: { id: true, name: true, status: true },
        orderBy: { name: "asc" },
      }),
    ]);

  return (
    <AppShell backHref="/">
      <div className="px-4 pt-5">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand" />
          <h1 className="font-serif text-2xl font-semibold">Panel de confianza</h1>
        </div>
        <div className="mt-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <Link
              key={t.id}
              href={`/moderacion?tab=${t.id}`}
              className={cn(
                "relative shrink-0 rounded-full px-3 py-1.5 text-[13px] font-medium",
                tab === t.id ? "bg-brand text-white" : "bg-white text-carbon ring-1 ring-black/[0.08]",
              )}
            >
              {t.label}
              {t.id === "reportes" && openReports.length > 0 && (
                <span className="ml-1 rounded-full bg-coral px-1.5 text-[10px] text-white">
                  {openReports.length}
                </span>
              )}
              {t.id === "pendientes" && pending.length > 0 && (
                <span className="ml-1 rounded-full bg-gold px-1.5 text-[10px] text-carbon">
                  {pending.length}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 pb-8">
        {tab === "reportes" && (
          <div className="flex flex-col gap-2.5">
            {openReports.length === 0 && (
              <Empty text="No hay reportes abiertos. Cuando un vecino toque Reportar publicación, aparece acá." />
            )}
            {openReports.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">
                      {r.provider?.name ?? "Contenido"}
                    </p>
                    <p className="text-xs text-carbon/55">
                      {REPORT_REASONS.find((x) => x.id === r.reason)?.label} ·{" "}
                      {r.reporter.displayName} · {timeAgo(r.createdAt)}
                    </p>
                    {r.details && (
                      <p className="mt-1 text-sm text-carbon/75">{r.details}</p>
                    )}
                  </div>
                  <StatusBadge status="reported" />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.provider && (
                    <Link
                      href={`/prestadores/${r.provider.id}`}
                      className="rounded-full bg-mist px-3 py-1 text-xs font-semibold"
                    >
                      Ver ficha
                    </Link>
                  )}
                  <form action={resolveReport.bind(null, r.id, "Revisado")}>
                    <button className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                      Resolver
                    </button>
                  </form>
                  <form action={dismissReport.bind(null, r.id)}>
                    <button className="rounded-full px-3 py-1 text-xs font-semibold text-carbon/50">
                      Descartar
                    </button>
                  </form>
                  {r.provider && (
                    <>
                      <form action={setProviderStatus.bind(null, r.provider.id, "hidden")}>
                        <button className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold text-coral">
                          Dar de baja
                        </button>
                      </form>
                      <form action={setProviderStatus.bind(null, r.provider.id, "outdated")}>
                        <button className="rounded-full px-3 py-1 text-xs font-semibold text-carbon/60">
                          Desactualizado
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "pendientes" && (
          <div className="flex flex-col gap-2.5">
            {pending.length === 0 && <Empty text="No hay publicaciones pendientes." />}
            {pending.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-carbon/55">
                      {p.source === "self" ? "Autopublicado" : "Cargado por vecino"} ·{" "}
                      {timeAgo(p.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-carbon/70">{p.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/prestadores/${p.id}`}
                    className="rounded-full bg-mist px-3 py-1 text-xs font-semibold"
                  >
                    Ver ficha
                  </Link>
                  <form action={setProviderStatus.bind(null, p.id, "approved")}>
                    <button className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                      Marcar revisada
                    </button>
                  </form>
                  <form action={setProviderStatus.bind(null, p.id, "hidden")}>
                    <button className="rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
                      Dar de baja
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "publicaciones" && (
          <div className="flex flex-col gap-2.5">
            {listed.length === 0 && <Empty text="No hay publicaciones visibles." />}
            {listed.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-carbon/55">
                      {p.source === "self" ? "Autopublicado" : "Cargado por vecino"} ·{" "}
                      {timeAgo(p.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    href={`/prestadores/${p.id}`}
                    className="rounded-full bg-mist px-3 py-1 text-xs font-semibold"
                  >
                    Ver ficha
                  </Link>
                  {p.status !== "approved" && (
                    <form action={setProviderStatus.bind(null, p.id, "approved")}>
                      <button className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
                        Marcar revisada
                      </button>
                    </form>
                  )}
                  <form action={setProviderStatus.bind(null, p.id, "hidden")}>
                    <button className="rounded-full bg-coral px-3 py-1 text-xs font-semibold text-white">
                      Dar de baja
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </div>
        )}

        {tab === "duplicados" && (
          <div className="flex flex-col gap-3">
            {duplicates.length === 0 && <Empty text="No hay posibles duplicados." />}
            {duplicates.map((p) => (
              <article
                key={p.id}
                className="rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]"
              >
                <div className="flex justify-between">
                  <p className="font-semibold">{p.name}</p>
                  <StatusBadge status={p.status} />
                </div>
                <p className="text-xs text-carbon/50">{p.phone}</p>
                <MergeForm duplicateId={p.id} providers={allProviders.filter((x) => x.id !== p.id)} />
              </article>
            ))}
          </div>
        )}

        {tab === "historial" && (
          <div className="flex flex-col gap-2">
            {events.length === 0 && <Empty text="Todavía no hay actividad." />}
            {events.map((e) => (
              <div
                key={e.id}
                className="rounded-2xl bg-white px-4 py-3 text-sm ring-1 ring-black/[0.04]"
              >
                <p className="font-medium">{e.action}</p>
                <p className="text-xs text-carbon/50">
                  {e.user.displayName} · {timeAgo(e.createdAt)}
                  {e.details ? ` · ${e.details}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}

        {tab === "categorias" && (
          <div className="flex flex-col gap-2">
            {categories.map((c) => (
              <form
                key={c.id}
                action={updateCategoryAction.bind(null, c.id)}
                className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 ring-1 ring-black/[0.04]"
              >
                <input
                  name="name"
                  defaultValue={c.name}
                  className="flex-1 bg-transparent text-sm outline-none"
                />
                <label className="flex items-center gap-1 text-[11px] text-carbon/60">
                  <input
                    type="checkbox"
                    name="isUrgency"
                    defaultChecked={c.isUrgency}
                    className="accent-brand"
                  />
                  Urgencia
                </label>
                <button className="text-xs font-semibold text-brand">Guardar</button>
              </form>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-carbon/55 ring-1 ring-black/[0.04]">
      {text}
    </p>
  );
}

function MergeForm({
  duplicateId,
  providers,
}: {
  duplicateId: string;
  providers: { id: string; name: string }[];
}) {
  async function action(formData: FormData) {
    "use server";
    const canonicalId = String(formData.get("canonicalId") ?? "");
    if (!canonicalId) return;
    await mergeProviders(canonicalId, duplicateId);
  }

  return (
    <form action={action} className="mt-3 flex gap-2">
      <select
        name="canonicalId"
        className="flex-1 rounded-xl bg-mist px-2 py-1.5 text-xs"
        defaultValue=""
      >
        <option value="" disabled>
          Fusionar en…
        </option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      <button className="rounded-full bg-brand px-3 py-1 text-xs font-semibold text-white">
        Fusionar
      </button>
    </form>
  );
}
