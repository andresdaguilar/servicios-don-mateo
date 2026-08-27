"use client";

import "./globals.css";

export default function GlobalError({
  retry,
  reset,
}: {
  error: Error & { digest?: string };
  retry?: () => void;
  reset?: () => void;
}) {
  const again = retry ?? reset;

  return (
    <html lang="es">
      <body className="min-h-dvh bg-paper font-sans text-carbon">
        <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col items-center justify-center px-8 text-center">
          <h1 className="font-serif text-2xl font-semibold">Algo no salió bien</h1>
          <p className="mt-2 text-sm leading-relaxed text-carbon/65">
            Hubo un problema al cargar la app. Probá de nuevo.
          </p>
          {again && (
            <button
              type="button"
              onClick={again}
              className="mt-5 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
            >
              Reintentar
            </button>
          )}
        </div>
      </body>
    </html>
  );
}
