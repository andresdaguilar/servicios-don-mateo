import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Wordmark } from "@/components/brand/Logo";
import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  backHref,
  right,
  className,
}: {
  children: React.ReactNode;
  backHref?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-[#E8EBE8]">
      <div
        className={cn(
          "mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-paper shadow-[0_0_40px_rgba(31,31,31,0.08)]",
          className,
        )}
      >
        <header className="z-30 flex shrink-0 items-center gap-2 border-b border-black/[0.04] bg-paper px-3 py-2.5">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Volver"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
          ) : null}
          <div className="min-w-0 flex-1">
            <Wordmark compact={Boolean(backHref)} />
          </div>
          {right ? <div className="flex shrink-0 items-center">{right}</div> : null}
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
