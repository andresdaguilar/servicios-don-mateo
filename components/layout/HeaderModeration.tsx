"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function HeaderModeration() {
  const pathname = usePathname();
  const { data } = useSession();
  if (data?.user?.role !== "moderator") return null;

  const active = pathname === "/moderacion" || pathname.startsWith("/moderacion/");

  return (
    <Link
      href="/moderacion"
      aria-label="Panel de moderación"
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-mist",
        active ? "text-brand" : "text-carbon/70",
      )}
    >
      <Shield className="h-5 w-5" strokeWidth={1.75} />
    </Link>
  );
}
