export function listingPhotos(
  photos: { url: string; kind?: string | null }[],
) {
  const profile = photos.find((p) => p.kind === "profile") ?? null;
  const gallery = photos.filter((p) => p.kind !== "profile");
  return {
    avatarUrl: profile?.url ?? gallery[0]?.url ?? null,
    gallery,
  };
}
