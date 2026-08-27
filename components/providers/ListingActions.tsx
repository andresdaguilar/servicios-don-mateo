import {
  activateProviderAction,
  deleteProviderAction,
  pauseProviderAction,
  restoreProviderAction,
} from "@/app/actions/providers";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cn } from "@/lib/utils";

export function ListingActions({
  providerId,
  paused,
  deleted,
  canToggle,
  compact,
}: {
  providerId: string;
  paused: boolean;
  deleted: boolean;
  canToggle: boolean;
  compact?: boolean;
}) {
  const btn = compact
    ? "text-xs font-semibold"
    : "rounded-full px-2.5 py-1 text-[11px] font-semibold";

  if (deleted) {
    return (
      <form action={restoreProviderAction.bind(null, providerId)}>
        <SubmitButton pendingLabel="Restaurando…" className={cn(btn, "text-brand-ink")}>
          Restaurar
        </SubmitButton>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {canToggle &&
        (paused ? (
          <form action={activateProviderAction.bind(null, providerId)}>
            <SubmitButton pendingLabel="Activando…" className={cn(btn, compact ? "text-brand-ink" : "bg-brand text-white")}>
              Activar
            </SubmitButton>
          </form>
        ) : (
          <form action={pauseProviderAction.bind(null, providerId)}>
            <SubmitButton pendingLabel="Desactivando…" className={cn(btn, compact ? "text-carbon/70" : "bg-mist text-carbon")}>
              Desactivar
            </SubmitButton>
          </form>
        ))}
      <form action={deleteProviderAction.bind(null, providerId)}>
        <SubmitButton
          pendingLabel="Borrando…"
          className={cn(btn, compact ? "text-coral" : "bg-coral/10 text-coral")}
        >
          Borrar
        </SubmitButton>
      </form>
    </div>
  );
}
