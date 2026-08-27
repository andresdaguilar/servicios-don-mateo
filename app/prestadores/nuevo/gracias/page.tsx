import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";

export default function GraciasPage() {
  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
        <h1 className="font-serif text-2xl font-semibold text-carbon">Quedó en revisión</h1>
        <p className="mt-3 text-sm leading-relaxed text-carbon/70">
          Un moderador va a revisar la ficha. Si hay un nombre parecido a otro contacto, también lo
          miramos para no duplicar.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-2xl bg-brand px-5 py-3 text-sm font-semibold text-white"
        >
          Volver al inicio
        </Link>
      </div>
    </AppShell>
  );
}
