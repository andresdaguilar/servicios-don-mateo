"use client";

import { useActionState } from "react";
import { replyRequestAction } from "@/app/actions/requests";

export function ReplyForm({
  requestId,
  providers,
}: {
  requestId: string;
  providers: { id: string; name: string }[];
}) {
  const [state, action, pending] = useActionState(replyRequestAction, null);

  return (
    <form action={action} className="mt-4 flex flex-col gap-2">
      <input type="hidden" name="requestId" value={requestId} />
      <textarea
        name="body"
        required
        minLength={4}
        rows={3}
        placeholder="Te recomiendo a Daniel, lo usé el mes pasado."
        className="rounded-2xl bg-mist px-3 py-3 text-sm outline-none"
      />
      <select name="providerId" className="rounded-2xl bg-mist px-3 py-3 text-sm">
        <option value="">Sin ficha (solo comentario)</option>
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
      {state?.error && <p className="text-sm text-coral">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-2xl bg-brand py-3 font-semibold text-white"
      >
        Responder
      </button>
    </form>
  );
}
