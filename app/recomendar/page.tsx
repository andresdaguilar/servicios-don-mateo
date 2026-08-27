import { redirect } from "next/navigation";

export default function RecomendarIndex() {
  redirect("/prestadores/nuevo?origen=vecino");
}
