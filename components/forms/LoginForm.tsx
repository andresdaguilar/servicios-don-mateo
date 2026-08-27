"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction } from "@/app/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Wordmark } from "@/components/brand/Logo";

export function LoginForm({ from }: { from: string }) {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <AppShell hideNav>
      <div className="px-5 pt-10">
        <Wordmark />
        <h1 className="mt-8 font-serif text-2xl font-semibold">Entrar</h1>
        <p className="mt-1 text-sm text-carbon/65">Para recomendar, guardar y publicar.</p>
        <form action={action} className="mt-6 flex flex-col gap-3">
          <input type="hidden" name="from" value={from} />
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
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
          <Link href="/registro" className="font-semibold text-brand">
            Registrate
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
