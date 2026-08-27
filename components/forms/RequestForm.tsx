"use client";

import { useActionState } from "react";
import { createRequestAction } from "@/app/actions/requests";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function RequestForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, action] = useActionState(createRequestAction, null);

  return (
          <form action={action} className="flex flex-1 flex-col gap-3 px-4 pb-8 pt-4">
        <h1 className="font-serif text-2xl font-semibold">Pedir recomendación</h1>
        <textarea
          name="body"
          required
          minLength={8}
          rows={4}
          placeholder="Busco gasista para pérdida. Zona Don Mateo. Urgente."
          className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
        <label className="text-sm font-medium">
          Rubro (opcional)
          <select name="categoryId" className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm">
            <option value="">Sin rubro</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="urgent" className="accent-coral" />
          Es urgente
        </label>
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <SubmitButton
          pendingLabel="Publicando…"
          className="mt-auto rounded-2xl bg-brand py-3.5 font-semibold text-white"
        >
          Publicar pedido
        </SubmitButton>
      </form>
  );
}
