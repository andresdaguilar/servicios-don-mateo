"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";

export function SearchBar({
  defaultValue = "",
  placeholder = "¿Qué necesitás?",
  rubro,
  className,
}: {
  defaultValue?: string;
  placeholder?: string;
  rubro?: string;
  className?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (pending) return;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (rubro) params.set("rubro", rubro);
    startTransition(() => {
      router.push(`/buscar${params.size ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex items-center gap-2", className)}>
      <label className="flex flex-1 items-center gap-2 rounded-2xl bg-mist px-3.5 py-3 text-carbon">
        {pending ? (
          <Spinner className="h-4 w-4 shrink-0 text-brand-ink" />
        ) : (
          <Search className="h-4 w-4 shrink-0 text-carbon/45" strokeWidth={1.75} />
        )}
        <input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          disabled={pending}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-carbon/40 disabled:opacity-70"
        />
      </label>
    </form>
  );
}
