import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Wordmark } from "@/components/brand/Logo";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeaderModeration } from "@/components/layout/HeaderModeration";
import { HeaderProfile } from "@/components/layout/HeaderProfile";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
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
    <div className="min-h-dvh bg-chrome">
      <div
        className={cn(
          "mx-auto flex h-dvh w-full max-w-[430px] flex-col bg-paper shadow-[0_0_40px_rgba(0,0,0,0.12)]",
          className,
        )}
      >
        <header className="z-30 flex shrink-0 items-center gap-2 border-b border-line bg-paper px-3 py-2.5">
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
          <div className="flex shrink-0 items-center gap-1.5">
            {right}
            <HeaderModeration />
            <ThemeToggle />
            <HeaderProfile />
          </div>
        </header>
        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
