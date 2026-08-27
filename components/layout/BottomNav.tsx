"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLinkStatus } from "next/link";
import { Home, Search, Plus } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/", label: "Inicio", icon: Home, exact: true },
  { href: "/prestadores/nuevo", label: "Publicar", icon: Plus, fab: true },
  { href: "/buscar", label: "Buscar", icon: Search },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="z-30 shrink-0 border-t border-line bg-card pb-[env(safe-area-inset-bottom)]">
      <ul className="grid grid-cols-3 px-1 pt-1">
        {ITEMS.map((item) => {
          const active =
            "exact" in item && item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          if ("fab" in item && item.fab) {
            return (
              <li key={item.href} className="-mt-5 flex justify-center">
                <Link
                  href={item.href}
                  prefetch
                  className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-[0_8px_20px_rgba(30,94,58,0.35)]"
                  aria-label={item.label}
                >
                  <Icon className="h-7 w-7" strokeWidth={2} />
                  <FabPending />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                prefetch
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium",
                  active ? "text-brand-ink" : "text-carbon/45",
                )}
              >
                <span className="relative">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                  <NavPending />
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function NavPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span className="absolute -right-2.5 -top-1 text-brand-ink">
      <Spinner className="h-3 w-3" />
    </span>
  );
}

function FabPending() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span className="absolute inset-0 flex items-center justify-center rounded-full bg-brand/80">
      <Spinner className="h-6 w-6" />
    </span>
  );
}
