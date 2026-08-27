"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { PhoneField } from "@/components/forms/PhoneField";

export function LoginForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <AppShell backHref="/">
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
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-2xl bg-brand py-3.5 font-semibold text-white"
          >
            {pending ? "Entrando…" : "Entrar"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-carbon/60">
          ¿No tenés cuenta?{" "}
          <Link href="/registro" className="font-semibold text-brand-ink">
            Registrate con el código del grupo
          </Link>
        </p>
        <p className="mt-3 text-center text-sm">
          <Link href="/faq" className="font-medium text-brand-ink">
            Cómo funciona la app
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
