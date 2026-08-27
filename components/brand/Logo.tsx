import { cn } from "@/lib/utils";

export function Logo({ className, size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <circle cx="32" cy="32" r="30" fill="#1E5E3A" />
      <circle cx="32" cy="32" r="27.5" stroke="#FAFAF8" strokeWidth="1.4" opacity="0.35" />
      <path
        d="M16 30.5L32 16l16 14.5V48a3 3 0 0 1-3 3H19a3 3 0 0 1-3-3V30.5Z"
        fill="#FAFAF8"
      />
      <path d="M26 19.5V16h6v5.2" stroke="#1E5E3A" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="32" cy="31" r="6.2" fill="#C4A574" />
      <path
        d="M24.5 31.2c0-4.6 3.2-8.2 7.5-8.2s7.5 3.6 7.5 8.2"
        fill="#1E5E3A"
      />
      <path
        d="M26 29.2c1.2-2.4 3.2-3.6 6-3.6s4.8 1.2 6 3.6"
        stroke="#143F27"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <ellipse cx="32" cy="28.2" rx="4.4" ry="1.3" fill="#2A6B42" />
      <circle cx="29.4" cy="31.2" r="0.9" fill="#1F1F1F" />
      <circle cx="34.6" cy="31.2" r="0.9" fill="#1F1F1F" />
      <path
        d="M28.8 34.6c1 .9 2.1 1.4 3.2 1.4s2.2-.5 3.2-1.4"
        stroke="#1F1F1F"
        strokeWidth="1.15"
        strokeLinecap="round"
      />
      <path
        d="M29.2 33.15c.7.15 1.4.2 2.8.2s2.1-.05 2.8-.2"
        stroke="#5A3A28"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
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
