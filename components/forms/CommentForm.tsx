"use client";

import { useActionState } from "react";
import { commentAction } from "@/app/actions/social";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function CommentForm({ providerId }: { providerId: string }) {
  const [state, action] = useActionState(commentAction, null);

  return (
      <form action={action} className="flex flex-1 flex-col gap-4 px-4 pb-8 pt-4">
        <h1 className="font-serif text-2xl font-semibold">Comentar</h1>
        <input type="hidden" name="providerId" value={providerId} />
        <textarea
          name="body"
          required
          minLength={4}
          rows={5}
          placeholder="¿Cómo te fue?"
          className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
        />
        {state?.error && <p className="text-sm text-coral">{state.error}</p>}
        {state?.ok && <p className="text-sm text-brand-ink">Comentario publicado.</p>}
        <SubmitButton
          pendingLabel="Publicando…"
          className="mt-auto rounded-2xl bg-brand py-3.5 font-semibold text-white"
        >
          Publicar
        </SubmitButton>
      </form>
  );
}
