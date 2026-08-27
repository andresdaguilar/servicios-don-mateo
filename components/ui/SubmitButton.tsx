"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function SubmitButton({
  children,
  pendingLabel,
  pendingOnlySpinner,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingLabel?: React.ReactNode;
  pendingOnlySpinner?: boolean;
}) {
  const { pending } = useFormStatus();
  const [locked, setLocked] = useState(false);
  const started = useRef(false);
  const busy = pending || locked;

  useEffect(() => {
    if (pending) started.current = true;
    if (started.current && !pending) {
      started.current = false;
      setLocked(false);
    }
  }, [pending]);

  useEffect(() => {
    if (!locked || started.current) return;
    const id = window.setTimeout(() => {
      if (!started.current) setLocked(false);
    }, 700);
    return () => window.clearTimeout(id);
  }, [locked]);

  return (
    <button
      type="submit"
      {...props}
      disabled={busy || props.disabled}
      aria-busy={busy}
      onClick={(e) => {
        props.onClick?.(e);
        if (!e.defaultPrevented) setLocked(true);
      }}
      className={cn(className, busy && "pointer-events-none opacity-70")}
    >
      {busy ? (
        pendingOnlySpinner ? (
          <Spinner className="h-4 w-4" />
        ) : (
          <span className="inline-flex items-center justify-center gap-2">
            <Spinner className="h-4 w-4" />
            {pendingLabel ?? children}
          </span>
        )
      ) : (
        children
      )}
    </button>
  );
}
