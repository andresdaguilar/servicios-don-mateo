import { ShellFrame } from "@/components/layout/ShellFrame";

export function AppShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="min-h-dvh bg-chrome">
      <ShellFrame className={className}>{children}</ShellFrame>
    </div>
  );
}
