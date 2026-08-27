"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";
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

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (rubro) params.set("rubro", rubro);
    router.push(`/buscar${params.size ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex items-center gap-2", className)}>
      <label className="flex flex-1 items-center gap-2 rounded-2xl bg-mist px-3.5 py-3 text-carbon">
        <Search className="h-4 w-4 shrink-0 text-carbon/45" strokeWidth={1.75} />
        <input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-carbon/40"
        />
      </label>
    </form>
  );
}
