"use client";

import { useActionState } from "react";
import { createProviderAction } from "@/app/actions/providers";
import { AppShell } from "@/components/layout/AppShell";

type Cat = { id: string; name: string };

export function ProviderForm({
  categories,
  source,
}: {
  categories: Cat[];
  source: "neighbor" | "self";
}) {
  const [state, action, pending] = useActionState(createProviderAction, null);

  return (
    <AppShell backHref="/">
      <form action={action} className="flex flex-1 flex-col gap-3 px-4 pb-8 pt-4">
        <input type="hidden" name="source" value={source} />
        <h1 className="font-serif text-2xl font-semibold">
          {source === "self" ? "Publicar servicio" : "Cargar prestador"}
        </h1>
        <p className="text-sm text-carbon/65">
          {source === "self"
            ? "Tu ficha queda pendiente hasta que un moderador la apruebe."
            : "Si el teléfono ya existe, vas a poder recomendar la ficha actual."}
        </p>
        <Field name="name" label="Nombre" placeholder="Daniel Gasista" required />
        <Field name="phone" label="Teléfono / WhatsApp" placeholder="11 5555-1234" required />
        <label className="text-sm font-medium">
          Rubro
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((c) => (
              <label
                key={c.id}
                className="rounded-full bg-white px-3 py-1.5 text-sm ring-1 ring-black/[0.08] has-[:checked]:bg-brand has-[:checked]:text-white has-[:checked]:ring-0"
              >
                <input type="checkbox" name="categoryIds" value={c.id} className="sr-only" />
                {c.name}
              </label>
            ))}
          </div>
        </label>
        <Field name="zone" label="Zona (opcional)" placeholder="a 3 cuadras / Don Mateo" />
        <Field
          name="license"
          label="Matrícula o habilitación (opcional)"
          placeholder="Mat. 12345"
        />
        <label className="text-sm font-medium">
          Descripción breve (opcional)
          <textarea
            name="description"
            rows={4}
            placeholder="Gasista matriculado, atiende pérdidas y calefones."
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
        </label>
        <label className="text-sm font-medium">
          Fotos (opcional)
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="mt-1 w-full text-sm"
          />
        </label>
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-2xl bg-brand py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Publicar"}
        </button>
      </form>
    </AppShell>
  );
}

function Field({
  name,
  label,
  placeholder,
  required,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
      />
    </label>
  );
}
