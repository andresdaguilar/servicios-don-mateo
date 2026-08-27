"use client";

import { FormEvent, useActionState, useState } from "react";
import { createProviderAction } from "@/app/actions/providers";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

type Cat = { id: string; name: string };

export function ProviderForm({
  categories,
  source,
}: {
  categories: Cat[];
  source: "neighbor" | "self";
}) {
  const [state, action, pending] = useActionState(createProviderAction, null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [photoLabel, setPhotoLabel] = useState("Ninguna seleccionada");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const rubros = data.getAll("categoryIds").filter(Boolean);
    const next = new Set<string>();
    if (name.length < 2) next.add("name");
    if (phone.length < 8) next.add("phone");
    if (rubros.length === 0) next.add("rubro");

    if (next.size > 0) {
      e.preventDefault();
      setMissing(next);
      setLocalError(friendlyError(next));
      return;
    }

    setMissing(new Set());
    setLocalError(null);
  }

  const error = localError ?? state?.error ?? null;

  return (
    <AppShell backHref="/">
      <form
        action={action}
        noValidate
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-3 px-4 pb-8 pt-4"
      >
        <input type="hidden" name="source" value={source} />
        <h1 className="font-serif text-2xl font-semibold">
          {source === "self" ? "Publicar servicio" : "Cargar prestador"}
        </h1>
        <p className="text-sm text-carbon/65">
          {source === "self"
            ? "Tu ficha queda pendiente hasta que un moderador la apruebe."
            : "Si el teléfono ya existe, vas a poder recomendar la ficha actual."}{" "}
          Nombre, teléfono y rubro son obligatorios. Se publica ya y queda pendiente de revisión.
        </p>
        <Field
          name="name"
          label="Nombre"
          placeholder="Daniel Gasista"
          required
          invalid={missing.has("name")}
        />
        <Field
          name="phone"
          label="Teléfono / WhatsApp"
          placeholder="11 5555-1234"
          required
          invalid={missing.has("phone")}
        />
        <fieldset>
          <legend className="text-sm font-medium">
            Rubro <RequiredMark />
          </legend>
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
          {missing.has("rubro") && (
            <p className="mt-1.5 text-xs text-coral">Elegí al menos un rubro.</p>
          )}
        </fieldset>
        <Field name="zone" label="Zona" placeholder="a 3 cuadras / Don Mateo" optional />
        <Field
          name="license"
          label="Matrícula o habilitación"
          placeholder="Mat. 12345"
          optional
        />
        <label className="text-sm font-medium">
          Descripción breve <OptionalMark />
          <textarea
            name="description"
            rows={4}
            placeholder="Gasista matriculado, atiende pérdidas y calefones."
            className="mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
        </label>
        <label className="text-sm font-medium">
          Fotos <OptionalMark />
          <span className="mt-1 flex items-center gap-2">
            <span className="rounded-2xl bg-mist px-3 py-3 text-sm font-normal text-brand">
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
                    ? "Ninguna seleccionada"
                    : n === 1
                      ? "1 foto seleccionada"
                      : `${n} fotos seleccionadas`,
                );
              }}
            />
          </span>
        </label>

        <div className="mt-3 rounded-2xl bg-brand-soft px-3.5 py-3">
          <p className="text-sm text-brand">
            Para publicar hace falta <span className="font-semibold">nombre</span>,{" "}
            <span className="font-semibold">teléfono</span> y{" "}
            <span className="font-semibold">al menos un rubro</span>. El resto es opcional.
          </p>
          {error && <p className="mt-2 text-sm font-medium text-coral">{error}</p>}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-brand py-3.5 font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Guardando…" : "Publicar"}
        </button>
      </form>
    </AppShell>
  );
}

function friendlyError(missing: Set<string>) {
  const parts: string[] = [];
  if (missing.has("name")) parts.push("el nombre");
  if (missing.has("phone")) parts.push("el teléfono");
  if (missing.has("rubro")) parts.push("un rubro");
  if (parts.length === 1) return `Falta ${parts[0]} para publicar.`;
  if (parts.length === 2) return `Faltan ${parts[0]} y ${parts[1]} para publicar.`;
  return "Completá el nombre, el teléfono y elegí un rubro para publicar.";
}

function RequiredMark() {
  return <span className="ml-1 text-xs font-normal text-coral">Obligatorio</span>;
}

function OptionalMark() {
  return <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>;
}

function Field({
  name,
  label,
  placeholder,
  required,
  optional,
  invalid,
}: {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  invalid?: boolean;
}) {
  return (
    <label className="text-sm font-medium">
      {label}
      {required ? <RequiredMark /> : null}
      {optional ? <OptionalMark /> : null}
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        className={cn(
          "mt-1 w-full rounded-2xl bg-mist px-3 py-3 text-sm outline-none",
          invalid && "ring-2 ring-coral",
        )}
      />
    </label>
  );
}
