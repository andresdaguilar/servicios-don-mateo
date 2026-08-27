export function canEditProvider(
  user: { id: string; role?: string } | null | undefined,
  provider: { ownerId: string | null; createdById: string },
) {
  if (!user?.id) return false;
  if (user.role === "moderator") return true;
  return provider.ownerId === user.id || provider.createdById === user.id;
}
