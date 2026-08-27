"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { reportAction } from "@/app/actions/social";
import { REPORT_REASONS } from "@/lib/constants";
import { AppShell, ScreenHeader } from "@/components/layout/AppShell";

export function ReportForm({ providerId }: { providerId: string }) {
  const [state, action, pending] = useActionState(reportAction, null);

  return (
    <AppShell hideNav>
      <ScreenHeader
        left={
          <Link
            href={`/prestadores/${providerId}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mist"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        }
        title="Reportar"
      />
      <form action={action} className="flex flex-1 flex-col gap-4 px-4 pb-8">
        <input type="hidden" name="providerId" value={providerId} />
        <p className="text-sm text-carbon/70">
          Los moderadores revisan cada reporte. Usalo si hay datos incorrectos, spam o abuso.
        </p>
        <label className="text-sm font-medium">
          Motivo
          <select
            name="reason"
            required
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          >
            {REPORT_REASONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </label>
        <textarea
          name="details"
          rows={4}
          placeholder="Detalle opcional"
          className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        {state?.ok && (
          <p className="text-sm text-brand">Gracias. Un moderador lo va a revisar.</p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="mt-auto rounded-2xl bg-coral py-3.5 font-semibold text-white"
        >
          Enviar reporte
        </button>
      </form>
    </AppShell>
  );
}
