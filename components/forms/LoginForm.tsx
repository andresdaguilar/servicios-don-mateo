"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { PhoneField } from "@/components/forms/PhoneField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm({ from }: { from: string }) {
  const [state, action] = useActionState(loginAction, null);

  return (
    <div className="px-5 pt-6 pb-8">
      <h1 className="font-serif text-2xl font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-carbon/65">Para recomendar, guardar y publicar.</p>
      <form action={action} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="from" value={from} />
        <PhoneField autoFocus />
        <input
          name="password"
          type="password"
          required
          placeholder="Contraseña"
          className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
        {state?.error && (
          <div className="rounded-2xl bg-coral/15 px-3.5 py-3">
            <p className="text-sm font-semibold text-coral">{state.error}</p>
            <p className="mt-1.5 text-sm text-carbon/75">
              Si es tu primera vez, no uses Entrar: primero tenés que registrarte.
            </p>
          </div>
        )}
        <SubmitButton
          pendingLabel="Entrando…"
          className="mt-2 rounded-2xl bg-brand py-3.5 font-semibold text-white"
        >
          Entrar
        </SubmitButton>
      </form>
      <div className="mt-5">
        <p className="text-center text-sm text-carbon/60">
          {state?.error ? "¿Todavía no te registraste?" : "¿Primera vez acá?"}
        </p>
        <Link
          href={state?.href ?? "/registro"}
          className="mt-2 flex w-full items-center justify-center rounded-2xl border border-brand bg-card py-3.5 text-[15px] font-semibold text-brand-ink"
        >
          {state?.hrefLabel ?? "Registrarme"}
        </Link>
        <p className="mt-2 text-center text-xs text-carbon/50">
          Vas a necesitar el código de invitación del grupo.
        </p>
      </div>
      <p className="mt-4 text-center text-sm">
        <Link href="/faq" className="font-medium text-brand-ink">
          Cómo funciona la app
        </Link>
      </p>
    </div>
  );
}
