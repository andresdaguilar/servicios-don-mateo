import { BottomNav } from "@/components/layout/BottomNav";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  hideNav = false,
  className,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-[#E8EBE8]">
      <div
        className={cn(
          "mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-paper shadow-[0_0_40px_rgba(31,31,31,0.08)]",
          className,
        )}
      >
        <div className="flex flex-1 flex-col">{children}</div>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}

export function ScreenHeader({
  title,
  left,
  right,
}: {
  title?: React.ReactNode;
  left?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="flex items-center gap-3 px-4 pb-3 pt-4">
      <div className="w-10">{left}</div>
      <div className="flex-1 text-center font-semibold text-carbon">{title}</div>
      <div className="flex w-10 justify-end">{right}</div>
    </header>
  );
}
