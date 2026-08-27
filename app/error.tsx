"use client";

import Link from "next/link";

export default function Error({
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  const again = retry ?? reset;

  return (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <h1 className="font-serif text-2xl font-semibold">Algo no salió bien</h1>
        <p className="mt-2 text-sm leading-relaxed text-carbon/65">
          No pudimos completar eso. Probá de nuevo; si sigue pasando, volvé al inicio.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          {again && (
            <button
              type="button"
              onClick={again}
              className="rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Reintentar
            </button>
          )}
          <Link href="/" className="text-sm font-semibold text-brand-ink">
            Volver al inicio
          </Link>
        </div>
      </div>
  );
}
