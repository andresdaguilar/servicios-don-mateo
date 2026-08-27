"use client";

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

  return (
    <button
      type="submit"
      {...props}
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={cn(className, pending && "pointer-events-none opacity-70")}
    >
      {pending ? (
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
