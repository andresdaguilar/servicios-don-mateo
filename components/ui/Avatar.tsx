import { cn, initials } from "@/lib/utils";

export function Avatar({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm" ? "h-10 w-10 text-xs" : size === "lg" ? "h-20 w-20 text-xl" : "h-12 w-12 text-sm";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        className={cn("rounded-full object-cover bg-mist", dim)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-brand-soft font-semibold text-brand-ink",
        dim,
      )}
    >
      {initials(name)}
    </div>
  );
}
