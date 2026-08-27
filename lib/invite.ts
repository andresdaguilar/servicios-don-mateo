export const INVITE_CODE = (process.env.COMMUNITY_ACCESS_CODE ?? "DONMATEO2026").toUpperCase();

export function isValidInviteCode(input: string | null | undefined) {
  if (!input) return false;
  return input.trim().toUpperCase() === INVITE_CODE;
}
