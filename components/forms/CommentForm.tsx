"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { commentAction } from "@/app/actions/social";
import { AppShell, ScreenHeader } from "@/components/layout/AppShell";

export function CommentForm({ providerId }: { providerId: string }) {
  const [state, action, pending] = useActionState(commentAction, null);

  return (
    <AppShell hideNav>
      <ScreenHeader
        left={
          <Link
            href={`/prestadores/${providerId}`}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-mist"
          >
            <ChevronLeft className="h-5 w-5" />
          </Link>
        }
        title="Comentar"
      />
      <form action={action} className="flex flex-1 flex-col gap-4 px-4 pb-8">
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
        {state?.ok && <p className="text-sm text-brand">Comentario publicado.</p>}
        <button
          type="submit"
          disabled={pending}
          className="mt-auto rounded-2xl bg-brand py-3.5 font-semibold text-white"
        >
          Publicar
        </button>
      </form>
    </AppShell>
  );
}
