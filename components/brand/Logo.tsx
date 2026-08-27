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
      <div className="leading-tight">
        <p className="font-serif text-[17px] font-semibold tracking-tight text-brand">
          Servicios Don Mateo
        </p>
        {!compact && (
          <p className="text-[11px] font-medium text-coral">
            Contactos recomendados por vecinos
          </p>
        )}
      </div>
    </div>
  );
}
