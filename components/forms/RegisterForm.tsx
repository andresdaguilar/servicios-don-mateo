"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { AppShell } from "@/components/layout/AppShell";
import { Wordmark } from "@/components/brand/Logo";

export function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <AppShell hideNav>
      <div className="px-5 pt-10">
        <Wordmark />
        <h1 className="mt-8 font-serif text-2xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-carbon/65">
          Hace falta el código de la comunidad para mantenerlo en Don Mateo.
        </p>
        <form action={action} className="mt-6 flex flex-col gap-3">
          <input
            name="name"
            required
            placeholder="Nombre y apellido"
            className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
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
            minLength={6}
            placeholder="Contraseña"
            className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
          <input
            name="communityCode"
            required
            placeholder="Código de comunidad"
            className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-2xl bg-brand py-3.5 font-semibold text-white"
          >
            {pending ? "Creando…" : "Registrarme"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-carbon/60">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand">
            Entrar
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
