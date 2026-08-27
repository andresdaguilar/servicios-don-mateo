export function PageSpinner() {
  return (
    <div
      className="flex flex-1 flex-col gap-2.5 px-4 py-6"
      role="status"
      aria-live="polite"
      aria-label="Cargando"
    >
      <div className="h-7 w-1/2 animate-pulse rounded-xl bg-mist" />
      <div className="h-12 animate-pulse rounded-2xl bg-mist" />
      <div className="mt-2 h-[88px] animate-pulse rounded-2xl bg-mist" />
      <div className="h-[88px] animate-pulse rounded-2xl bg-mist" />
      <div className="h-[88px] animate-pulse rounded-2xl bg-mist" />
    </div>
  );
}
