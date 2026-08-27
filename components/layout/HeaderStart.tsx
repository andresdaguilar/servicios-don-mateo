"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLinkStatus } from "next/link";
import { ChevronLeft } from "lucide-react";
import { Wordmark } from "@/components/brand/Logo";
import { Spinner } from "@/components/ui/Spinner";
import { backHrefFor } from "@/lib/nav";

export function HeaderStart() {
  const pathname = usePathname();
  const backHref = backHrefFor(pathname);

  return (
    <>
      {backHref ? (
        <Link
          href={backHref}
          prefetch
          aria-label="Volver"
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist"
        >
          <ChevronLeft className="h-5 w-5" />
          <IconPending />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <Wordmark compact={Boolean(backHref)} />
      </div>
    </>
  );
}

export function IconPending() {
  const { pending } = useLinkStatus();
  return (
    <span
      aria-hidden
      className={
        pending
          ? "absolute inset-0 flex items-center justify-center rounded-full bg-mist/85"
          : "hidden"
      }
    >
      <Spinner className="h-4 w-4 text-brand-ink" />
    </span>
  );
}
