"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import { BottomNav } from "@/components/layout/BottomNav";
import { HeaderModeration } from "@/components/layout/HeaderModeration";
import { HeaderProfile } from "@/components/layout/HeaderProfile";
import { HeaderStart } from "@/components/layout/HeaderStart";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { NavigationProgress } from "@/components/navigation/NavigationProgress";
import { cn } from "@/lib/utils";

export function ShellFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const pathname = usePathname();
  const admin = pathname.startsWith("/moderacion");

  return (
    <div
      className={cn(
        "relative mx-auto flex h-dvh w-full flex-col bg-paper",
        admin
          ? "max-w-[430px] shadow-[0_0_40px_rgba(0,0,0,0.12)] md:max-w-none md:shadow-none"
          : "max-w-[430px] shadow-[0_0_40px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <Suspense fallback={null}>
        <NavigationProgress />
      </Suspense>
      <header className="z-30 flex shrink-0 items-center gap-2 border-b border-line bg-paper px-3 py-2.5 md:px-5">
        <HeaderStart />
        <div className="flex shrink-0 items-center gap-1.5">
          <HeaderModeration />
          <ThemeToggle />
          <HeaderProfile />
        </div>
      </header>
      <main
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          admin ? "overflow-hidden" : "overflow-y-auto",
        )}
      >
        {children}
      </main>
      <div className={admin ? "md:hidden" : undefined}>
        <BottomNav />
      </div>
    </div>
  );
}
