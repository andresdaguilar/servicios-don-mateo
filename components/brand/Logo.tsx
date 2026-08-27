import { cn } from "@/lib/utils";

export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <img
      src="/logo-don-mateo.png"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden
    />
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <Logo size={compact ? 36 : 42} />
      <p className="min-w-0 font-serif text-[20px] font-semibold leading-tight tracking-tight text-brand">
        Servicios Don Mateo
      </p>
    </div>
  );
}
