"use client";

import { useState } from "react";

export function PhotoFields({
  currentAvatar,
  currentGallery = [],
}: {
  currentAvatar?: string | null;
  currentGallery?: string[];
}) {
  const [avatarLabel, setAvatarLabel] = useState(
    currentAvatar ? "Se mantiene la actual" : "Ninguna seleccionada",
  );
  const [galleryLabel, setGalleryLabel] = useState(
    currentGallery.length > 0
      ? `${currentGallery.length} en la ficha`
      : "Ninguna seleccionada",
  );

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium">
        Foto de perfil{" "}
        <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>
        {currentAvatar ? (
          <span className="mt-2 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentAvatar}
              alt=""
              className="h-14 w-14 rounded-full object-cover ring-1 ring-line"
            />
            <span className="text-xs font-normal text-carbon/55">
              Así se ve ahora. Elegí otra para reemplazarla.
            </span>
          </span>
        ) : null}
        <span className="mt-2 flex items-center gap-2">
          <span className="rounded-2xl bg-mist px-3 py-3 text-sm font-normal text-brand-ink">
            Elegir foto
          </span>
          <span className="text-xs font-normal text-carbon/50">{avatarLabel}</span>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const n = e.target.files?.length ?? 0;
              setAvatarLabel(n === 0 ? "Ninguna seleccionada" : "1 foto de perfil");
            }}
          />
        </span>
      </label>
      <label className="text-sm font-medium">
        Otras fotos{" "}
        <span className="ml-1 text-xs font-normal text-carbon/45">Opcional</span>
        <span className="mt-1 block text-xs font-normal text-carbon/50">
          Trabajos, local o lo que quieras mostrar. Hasta 4.
        </span>
        {currentGallery.length > 0 ? (
          <span className="mt-2 flex gap-2 overflow-x-auto">
            {currentGallery.map((url) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={url}
                src={url}
                alt=""
                className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-line"
              />
            ))}
          </span>
        ) : null}
        <span className="mt-2 flex items-center gap-2">
          <span className="rounded-2xl bg-mist px-3 py-3 text-sm font-normal text-brand-ink">
            Elegir fotos
          </span>
          <span className="text-xs font-normal text-carbon/50">{galleryLabel}</span>
          <input
            type="file"
            name="photos"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              const n = e.target.files?.length ?? 0;
              setGalleryLabel(
                n === 0
                  ? "Ninguna seleccionada"
                  : n === 1
                    ? "1 foto nueva"
                    : `${n} fotos nuevas`,
              );
            }}
          />
        </span>
      </label>
    </div>
  );
}
