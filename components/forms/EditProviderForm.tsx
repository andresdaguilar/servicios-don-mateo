"use client";

import { FormEvent, useActionState, useState } from "react";
import { updateProviderAction } from "@/app/actions/providers";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { formatPhone } from "@/lib/phone";
import { cn } from "@/lib/utils";

type Cat = { id: string; name: string };

export function EditProviderForm({
  providerId,
  categories,
  initial,
}: {
  providerId: string;
  categories: Cat[];
  initial: {
    name: string;
    phone: string;
    zone: string;
    license: string;
    description: string;
    categoryIds: string[];
  };
}) {
  const [state, action] = useActionState(
    updateProviderAction.bind(null, providerId),
    null,
  );
  const [rubros, setRubros] = useState<string[]>(initial.categoryIds);
  const [localError, setLocalError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [photoLabel, setPhotoLabel] = useState("Ninguna nueva");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const next = new Set<string>();
    if (name.length < 2) next.add("name");
    if (phone.length < 8) next.add("phone");
    if (rubros.length === 0) next.add("rubro");
    if (next.size > 0) {
      e.preventDefault();
      setMissing(next);
      setLocalError(
        next.size === 1
          ? `Falta ${next.has("name") ? "el nombre" : next.has("phone") ? "el teléfono" : "un rubro"} para guardar.`
          : "Completá el nombre, el teléfono y elegí un rubro.",
      );
    }
  }

  const error = localError ?? state?.error ?? null;

  return (
    <form
      action={action}
      noValidate
      onSubmit={onSubmit}
      className="flex flex-1 flex-col gap-3 px-4 pb-8 pt-4"
    >
      {rubros.map((id) => (
        <input key={id} type="hidden" name="categoryIds" value={id} />
      ))}
      <h1 className="font-serif text-2xl font-semibold">Editar ficha</h1>
      <p className="text-sm text-carbon/65">
        Podés corregir datos de contacto, rubro o la descripción. Si cambiás nombre o teléfono, la
        ficha puede volver a revisión.
      </p>
      <label className="text-sm font-medium">
        Nombre <span className="ml-1 text-xs font-normal text-coral">Obligatorio</span>
        <input
          name="name"
          defaultValue={initial.name}
          required
          aria-invalid={missing.has("name") || undefined}
          className={cn(
            "mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none",
            missing.has("name") && "ring-2 ring-coral",
          )}
        />
      </label>
      <label className="text-sm font-medium">
        Teléfono / WhatsApp <span className="ml-1 text-xs font-normal text-coral">Obligatorio</span>
        <input
          name="phone"
          defaultValue={formatPhone(initial.phone)}
          required
          aria-invalid={missing.has("phone") || undefined}
          className={cn(
            "mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none",
            missing.has("phone") && "ring-2 ring-coral",
          )}
        />
      </label>
      <fieldset>
        <legend className="text-sm font-medium">
          Rubro <span className="ml-1 text-xs font-normal text-coral">Obligatorio</span>
        </legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((c) => {
            const on = rubros.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() =>
                  setRubros((prev) =>
                    prev.includes(c.id) ? prev.filter((id) => id !== c.id) : [...prev, c.id],
                  )
                }
                aria-pressed={on}
                className={cn(
                  "rounded-full px-3 py-1.5 text-sm ring-1",
                  on ? "bg-brand text-white ring-brand" : "bg-card text-carbon ring-line",
                )}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        {missing.has("rubro") && (
          <p className="mt-1.5 text-xs text-coral">Elegí al menos un rubro.</p>
        )}
      </fieldset>
      <label className="text-sm font-medium">
        Zona <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>
        <input
          name="zone"
          defaultValue={initial.zone}
          className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
      </label>
      <label className="text-sm font-medium">
        Matrícula o habilitación{" "}
        <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>
        <input
          name="license"
          defaultValue={initial.license}
          className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
      </label>
      <label className="text-sm font-medium">
        Descripción breve <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>
        <textarea
          name="description"
          rows={4}
          defaultValue={initial.description}
          className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
      </label>
      <label className="text-sm font-medium">
        Sumar fotos <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>
        <span className="mt-1 flex items-center gap-2">
          <span className="rounded-2xl bg-mist px-3 py-3 text-sm font-normal text-brand-ink">
            Elegir fotos
          </span>
          <span className="text-xs font-normal text-carbon/50">{photoLabel}</span>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const n = e.target.files?.length ?? 0;
              setPhotoLabel(
                n === 0
                  ? "Ninguna nueva"
                  : n === 1
                    ? "1 foto nueva"
                    : `${n} fotos nuevas`,
              );
            }}
          />
        </span>
      </label>
      {error && (
        <div className="mt-3 rounded-2xl bg-coral/15 px-3.5 py-3">
          <p className="text-sm font-semibold text-coral">{error}</p>
        </div>
      )}
      <SubmitButton
        pendingLabel="Guardando…"
        className="rounded-2xl bg-brand py-3.5 font-semibold text-white"
      >
        Guardar cambios
      </SubmitButton>
    </form>
  );
}
