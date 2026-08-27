"use client";

import { FormEvent, useActionState, useState } from "react";
import Link from "next/link";
import { createProviderAction } from "@/app/actions/providers";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { cn } from "@/lib/utils";

type Cat = { id: string; name: string };

export function ProviderForm({
  categories,
  defaultOwn = false,
}: {
  categories: Cat[];
  defaultOwn?: boolean;
}) {
  const [state, action] = useActionState(createProviderAction, null);
  const [isOwn, setIsOwn] = useState(defaultOwn);
  const [rubros, setRubros] = useState<string[]>([]);
  const [localError, setLocalError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());
  const [photoLabel, setPhotoLabel] = useState("Ninguna seleccionada");

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
      setLocalError(friendlyError(next));
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
        <input type="hidden" name="source" value={isOwn ? "self" : "neighbor"} />
        {rubros.map((id) => (
          <input key={id} type="hidden" name="categoryIds" value={id} />
        ))}
        <h1 className="font-serif text-2xl font-semibold">Publicar un servicio</h1>
        <p className="text-sm text-carbon/65">
          {isOwn
            ? "Esta ficha queda a tu nombre. Se ve en el barrio ya y un moderador la revisa si hace falta."
            : "Cargá a alguien que conocés y recomendarías. Si el teléfono ya está, te llevamos a esa ficha."}
        </p>
        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-card px-3.5 py-3 ring-1 ring-line has-[:checked]:bg-brand-soft has-[:checked]:ring-brand/30">
          <input
            type="checkbox"
            checked={isOwn}
            onChange={(e) => setIsOwn(e.target.checked)}
            className="mt-1 h-4 w-4 accent-brand"
          />
          <span>
            <span className="block text-sm font-semibold text-carbon">
              Este es mi propio servicio
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-carbon/60">
              Dejalo destildado si estás recomendando a otra persona. Marcá esto solo si el oficio
              es tuyo.
            </span>
          </span>
        </label>
        <Field
          name="name"
          label={isOwn ? "Tu nombre o cómo te conocen" : "Nombre del prestador"}
          placeholder={isOwn ? "Ana, gasista" : "Daniel Gasista"}
          required
          invalid={missing.has("name")}
        />
        <Field
          name="phone"
          label={isOwn ? "Tu WhatsApp" : "Teléfono / WhatsApp"}
          placeholder="11 5555-1234"
          required
          invalid={missing.has("phone")}
        />
        <fieldset>
          <legend className="text-sm font-medium">
            Rubro <RequiredMark />
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
                    on
                      ? "bg-brand text-white ring-brand"
                      : "bg-card text-carbon ring-line",
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
                    ? "Ninguna seleccionada"
                    : n === 1
                      ? "1 foto seleccionada"
                      : `${n} fotos seleccionadas`,
                );
              }}
            />
          </span>
        </label>

        {(error || state?.href) && (
          <div className="mt-3 rounded-2xl bg-coral/15 px-3.5 py-3">
            {error && <p className="text-sm font-semibold text-coral">{error}</p>}
            {state?.href && (
              <Link
                href={state.href}
                className="mt-2 inline-flex text-sm font-semibold text-brand-ink"
              >
                {state.hrefLabel ?? "Ver ficha"}
              </Link>
            )}
          </div>
        )}
        <SubmitButton
          pendingLabel="Publicando…"
          className="rounded-2xl bg-brand py-3.5 font-semibold text-white"
        >
          {isOwn ? "Publicar mi oficio" : "Publicar"}
        </SubmitButton>
      </form>
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
