"use client";

import { FormEvent, useActionState, useState } from "react";
import { reportAction } from "@/app/actions/social";
import { REPORT_REASONS } from "@/lib/constants";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ReportForm({ providerId }: { providerId: string }) {
  const [state, action] = useActionState(reportAction, null);
  const [localError, setLocalError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const reason = String(data.get("reason") ?? "");
    const details = String(data.get("details") ?? "").trim();
    if (!reason) {
      e.preventDefault();
      setLocalError("Elegí un motivo.");
      return;
    }
    if (details.length < 8) {
      e.preventDefault();
      setLocalError("Contanos un poco más qué te resultó extraño.");
      return;
    }
    setLocalError(null);
  }

  const error = localError ?? state?.error ?? null;

  return (
      <form
        action={action}
        noValidate
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4"
      >
        <h1 className="font-serif text-2xl font-semibold">Reportar publicación</h1>
        <input type="hidden" name="providerId" value={providerId} />
        <p className="text-sm text-carbon/70">
          Si algo te resulta raro, avisá. La ficha sigue visible y un moderador la revisa con tu
          motivo.
        </p>
        <label className="text-sm font-medium">
          Motivo <span className="text-xs font-normal text-coral">Obligatorio</span>
          <select
            name="reason"
            required
            defaultValue=""
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          >
            <option value="" disabled>
              Elegí un motivo
            </option>
            {REPORT_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium">
          ¿Qué pasó? <span className="text-xs font-normal text-coral">Obligatorio</span>
          <textarea
            name="details"
            rows={4}
            required
            minLength={8}
            placeholder="Ej.: el teléfono no corresponde, parece spam, o el dato no cierra."
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
        </label>
        {error && <p className="text-sm text-coral">{error}</p>}
        {state?.ok && (
          <p className="text-sm text-brand-ink">Gracias. Un moderador lo va a revisar.</p>
        )}
        <SubmitButton
          pendingLabel="Enviando…"
          className="mt-auto rounded-2xl bg-coral py-3.5 font-semibold text-white"
        >
          Enviar reporte
        </SubmitButton>
      </form>
  );
}
