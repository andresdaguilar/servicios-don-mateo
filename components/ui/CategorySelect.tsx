"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

export function CategorySelect({
  categories,
  value,
  q,
}: {
  categories: { slug: string; name: string }[];
  value?: string;
  q?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(slug: string) {
    if (pending) return;
    const params = new URLSearchParams();
    if (slug) params.set("rubro", slug);
    if (q?.trim()) params.set("q", q.trim());
    startTransition(() => {
      router.push(`/buscar${params.size ? `?${params.toString()}` : ""}`);
    });
  }

  return (
    <label className="relative block">
      <span className="sr-only">Categoría</span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-2xl bg-mist px-3.5 py-3 pr-10 text-[15px] text-carbon outline-none disabled:opacity-70"
        disabled={pending}
      >
        <option value="">Todas las categorías</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      {pending ? (
        <Spinner className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-ink" />
      ) : (
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-carbon/45"
          strokeWidth={1.75}
        />
      )}
    </label>
  );
}
