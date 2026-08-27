"use client";

export function PhoneField({
  defaultValue,
  autoFocus,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-carbon">Celular</span>
      <div className="flex overflow-hidden rounded-2xl bg-mist">
        <span className="flex items-center px-3 text-sm font-semibold text-brand">+549</span>
        <input
          name="phone"
          type="tel"
          inputMode="tel"
          required
          autoFocus={autoFocus}
          defaultValue={defaultValue}
          placeholder="11 1234-5678"
          autoComplete="tel"
          className="w-full bg-transparent py-3 pr-3 text-sm outline-none"
        />
      </div>
      <span className="mt-1 block text-xs text-carbon/50">Solo celulares de Argentina.</span>
    </label>
  );
}
