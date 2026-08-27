"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaderProfile() {
  const pathname = usePathname();
  const active = pathname === "/cuenta" || pathname.startsWith("/cuenta/");

  return (
    <Link
      href="/cuenta"
      aria-label="Perfil"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-mist",
        active ? "text-brand" : "text-carbon/70",
      )}
    >
      <UserRound className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  );
}
