"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Inicio", icon: Home, exact: true },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/prestadores/nuevo", label: "Publicar", icon: Plus, fab: true },
  { href: "/solicitudes", label: "Mensajes", icon: MessageCircle },
  { href: "/cuenta", label: "Perfil", icon: UserRound },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 z-30 border-t border-black/[0.06] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="grid grid-cols-5 px-1 pt-1">
        {ITEMS.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          if ("fab" in item && item.fab) {
            return (
              <li key={item.href} className="-mt-6 flex justify-center">
                <Link
                  href={item.href}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(30,94,58,0.35)]"
                  aria-label={item.label}
                >
                  <Icon className="h-7 w-7" strokeWidth={2} />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                  active ? "text-brand" : "text-carbon/45",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.75} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
