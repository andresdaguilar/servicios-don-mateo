import Link from "next/link";

export default function GraciasPage() {
  return (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <h1 className="font-serif text-2xl font-semibold text-carbon">Quedó en revisión</h1>
        <p className="mt-3 text-sm leading-relaxed text-carbon/70">
          La ficha ya se ve en el barrio y queda pendiente de revisión. Si un vecino la reporta, un
          moderador la analiza y puede darla de baja.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Volver al inicio
        </Link>
      </div>
  );
}
