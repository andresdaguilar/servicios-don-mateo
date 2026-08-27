"use client";

import { useActionState } from "react";
import { recommendAction } from "@/app/actions/social";
import { TRUST_TAGS } from "@/lib/constants";
import { AppShell } from "@/components/layout/AppShell";

export function RecommendForm({
  providerId,
  providerName,
}: {
  providerId: string;
  providerName: string;
}) {
  const [state, action, pending] = useActionState(recommendAction, null);

  return (
    <AppShell backHref={`/prestadores/${providerId}`}>
      <form action={action} className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
        <h1 className="font-serif text-2xl font-semibold">Recomendar</h1>
        <input type="hidden" name="providerId" value={providerId} />
        <p className="text-sm text-carbon/70">
          Contá tu experiencia con <span className="font-semibold text-carbon">{providerName}</span>.
        </p>

        <label className="text-sm font-medium">
          Calificación
          <select
            name="rating"
            defaultValue="5"
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          >
            <option value="5">5 — Excelente</option>
            <option value="4">4 — Muy bueno</option>
            <option value="3">3 — Bien</option>
            <option value="2">2 — Regular</option>
            <option value="1">1 — Mal</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="hired" defaultChecked className="accent-brand" />
          Lo contraté
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="wouldCallAgain" defaultChecked className="accent-brand" />
          Lo volvería a llamar
        </label>

        <fieldset>
          <legend className="text-sm font-medium">Etiquetas</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {TRUST_TAGS.map((tag) => (
              <label
                key={tag.id}
                className="cursor-pointer rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-black/[0.08] has-[:checked]:bg-brand has-[:checked]:text-white has-[:checked]:ring-0"
              >
                <input type="checkbox" name="tags" value={tag.id} className="sr-only" />
                {tag.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="text-sm font-medium">
          Comentario
          <textarea
            name="comment"
            required
            minLength={8}
            rows={4}
            placeholder="Fue puntual y dejó todo prolijo."
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
        </label>

        {state?.error && <p className="text-sm text-coral">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-auto rounded-2xl bg-brand py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Enviando…" : "Publicar recomendación"}
        </button>
      </form>
    </AppShell>
  );
}
