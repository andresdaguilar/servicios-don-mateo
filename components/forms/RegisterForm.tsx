"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction } from "@/app/actions/auth";
import { PhoneField } from "@/components/forms/PhoneField";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function RegisterForm({ inviteCode }: { inviteCode?: string }) {
  const [state, action] = useActionState(registerAction, null);
  const invited = Boolean(inviteCode);

  return (
          <div className="px-5 pt-6 pb-8">
        <h1 className="font-serif text-2xl font-semibold">Crear cuenta</h1>
        <p className="mt-1 text-sm text-carbon/65">
          {invited
            ? "Entraste con el link del grupo. Completá tus datos para unirte."
            : "Solo vecinos con el código de invitación del grupo."}
        </p>
        <form action={action} className="mt-6 flex flex-col gap-3">
          <input
            name="name"
            required
            placeholder="Nombre y apellido"
            className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
          <PhoneField />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Contraseña"
            className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
          />
          {invited ? (
            <input type="hidden" name="communityCode" value={inviteCode} />
          ) : (
            <input
              name="communityCode"
              required
              placeholder="Código de invitación"
              className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
            />
          )}
          {state?.error && <p className="text-sm text-coral">{state.error}</p>}
          <SubmitButton
            pendingLabel="Creando…"
            className="mt-2 rounded-2xl bg-brand py-3.5 font-semibold text-white"
          >
            Registrarme
          </SubmitButton>
        </form>
        <p className="mt-4 text-center text-sm text-carbon/60">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="font-semibold text-brand-ink">
            Entrar
          </Link>
        </p>
      </div>
  );
}
