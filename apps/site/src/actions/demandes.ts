"use server";

import { revalidatePath } from "next/cache";
import { marquerDemande } from "@gbum/db";
import { exigerCompte } from "../auth/garde";

export async function basculerDemande(donnees: FormData): Promise<void> {
  await exigerCompte();
  const id = donnees.get("id");
  const traitee = donnees.get("traitee") === "oui";
  if (typeof id !== "string") return;
  await marquerDemande(id, traitee);
  revalidatePath("/admin/demandes");
  revalidatePath("/admin");
}
