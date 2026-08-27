import Link from "next/link";

export default function NotFound() {
  return (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <h1 className="font-serif text-2xl font-semibold">No está esa ficha</h1>
        <p className="mt-2 text-sm text-carbon/65">
          Puede estar en revisión o el enlace no es válido.
        </p>
        <Link href="/" className="mt-5 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white">
          Volver al inicio
        </Link>
      </div>
  );
}
