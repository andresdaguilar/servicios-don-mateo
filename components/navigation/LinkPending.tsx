"use client";

import { useLinkStatus } from "next/link";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function LinkPending({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { pending } = useLinkStatus();

  return (
    <span className={cn("contents", pending && "opacity-60", className)}>
      {children}
      {pending ? (
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-brand-ink">
          <Spinner className="h-4 w-4" />
        </span>
      ) : null}
    </span>
  );
}
