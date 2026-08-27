import Link from "next/link";
import { Phone } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { ProviderCard } from "@/components/ui/ProviderCard";
import { getUrgencyContacts, searchProviders } from "@/lib/queries";
import { telLink, whatsappLink } from "@/lib/phone";

export default async function UrgenciasPage() {
  const [contacts, providers] = await Promise.all([
    getUrgencyContacts(),
    searchProviders({ urgency: true }),
  ]);

  return (
    <AppShell backHref="/">
      <div className="px-4 pb-8 pt-4">
        <h1 className="font-serif text-2xl font-semibold">Urgencias</h1>
        <p className="text-sm text-carbon/65">
          Lo que suele hacer falta rápido. También están administración y emergencias del barrio.
        </p>

        <h2 className="mt-5 text-sm font-semibold">Contactos del barrio</h2>
        <div className="mt-2 flex flex-col gap-2">
          {contacts.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 ring-1 ring-black/[0.04]"
            >
              <div>
                <p className="font-semibold text-carbon">{c.name}</p>
                {c.note && <p className="text-xs text-carbon/55">{c.note}</p>}
              </div>
              <div className="flex gap-2">
                <a
                  href={whatsappLink(c.phone)}
                  className="rounded-full bg-brand px-3 py-1.5 text-xs font-semibold text-white"
                >
                  WhatsApp
                </a>
                <a
                  href={telLink(c.phone)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-mist text-brand"
                >
                  <Phone className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        <h2 className="mt-6 text-sm font-semibold">Prestadores de urgencia</h2>
        <div className="mt-2 flex flex-col gap-2.5">
          {providers.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
