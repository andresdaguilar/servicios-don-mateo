"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createRequestAction } from "@/app/actions/requests";
import { AppShell, ScreenHeader } from "@/components/layout/AppShell";

export function RequestForm({
  categories,
}: {
  categories: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(createRequestAction, null);

  return (
    <AppShell hideNav>
      <ScreenHeader
        left={
          <Link
            href="/solicitudes"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mist"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        }
        title="Pedir recomendación"
      />
      <form action={action} className="flex flex-1 flex-col gap-3 px-4 pb-8">
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
        <button
          type="submit"
          disabled={pending}
          className="mt-auto rounded-2xl bg-brand py-3.5 font-semibold text-white"
        >
          Publicar pedido
        </button>
      </form>
    </AppShell>
  );
}
