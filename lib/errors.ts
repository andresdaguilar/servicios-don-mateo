import { Prisma } from "@prisma/client";
import { unstable_rethrow } from "next/navigation";
import type { ActionState } from "@/app/actions/auth";

export function friendlyDbError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = Array.isArray(error.meta?.target)
        ? error.meta.target.join(" ")
        : String(error.meta?.target ?? "");
      if (target.includes("ownerId")) {
        return "Ya publicaste un servicio con esta cuenta. Podés verlo desde Perfil.";
      }
      if (target.includes("phone")) {
        return "Ese teléfono ya está en otra ficha.";
      }
      return "Ese dato ya está cargado.";
    }
    if (error.code === "P2025") return "No encontramos eso.";
  }
  if (error instanceof Error) {
    if (error.message === "UNAUTHENTICATED") {
      return "Tenés que entrar con tu cuenta para continuar.";
    }
    if (error.message === "FORBIDDEN") {
      return "No tenés permiso para hacer eso.";
    }
  }
  return "Algo no salió bien. Probá de nuevo en un momento.";
}

export async function runAction(
  fn: () => Promise<ActionState>,
): Promise<ActionState> {
  try {
    return await fn();
  } catch (error) {
    unstable_rethrow(error);
    console.error(error);
    return { error: friendlyDbError(error) };
  }
}
