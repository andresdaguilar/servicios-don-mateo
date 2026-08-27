import { AppShell } from "@/components/layout/AppShell";
import { FaqList } from "@/components/ui/FaqList";

export default function FaqPage() {
  return (
    <AppShell backHref="/">
      <div className="px-4 pb-8 pt-4">
        <h1 className="font-serif text-2xl font-semibold">Preguntas frecuentes</h1>
        <p className="mt-1 mb-5 text-sm text-carbon/65">
          Cómo funciona la agenda del barrio, quién puede usarla y cómo cuidamos los datos.
        </p>
        <FaqList />
      </div>
    </AppShell>
  );
}
